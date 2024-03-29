<?php

/**
 * PostFinance Checkout Shopware 5
 *
 * This Shopware 5 extension enables to process payments with PostFinance Checkout (https://postfinance.ch/en/business/products/e-commerce/postfinance-checkout-all-in-one.html/).
 *
 * @package PostFinanceCheckout_Payment
 * @author wallee AG (http://www.wallee.com/)
 * @license http://www.apache.org/licenses/LICENSE-2.0  Apache Software License (ASL 2.0)
 */

namespace PostFinanceCheckoutPayment\Subscriber;

use Enlight\Event\SubscriberInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Shopware\Components\Model\ModelManager;
use Shopware\Models\Plugin\Plugin;
use Shopware\Models\Payment\Payment;

class Backend implements SubscriberInterface
{

    /**
     *
     * @var ContainerInterface
     */
    private $container;

    /**
     *
     * @var ModelManager
     */
    private $modelManager;

    public static function getSubscribedEvents()
    {
        return [
            'Enlight_Controller_Action_PostDispatch_Backend_Index' => 'onPostDispatchBackendIndex',
            'Enlight_Controller_Action_PreDispatch_Backend_Order' => 'onPreDispatchBackendOrder',
            'Enlight_Controller_Action_PostDispatch_Backend_Order' => 'onPostDispatchBackendOrder'
        ];
    }

    /**
     * Constructor.
     *
     * @param ContainerInterface $container
     * @param ModelManager $modelManager
     */
    public function __construct(ContainerInterface $container, ModelManager $modelManager)
    {
        $this->container = $container;
        $this->modelManager = $modelManager;
    }

    public function onPostDispatchBackendIndex(\Enlight_Event_EventArgs $args)
    {
        $args->getSubject()->View()->extendsTemplate('backend/post_finance_checkout_payment_index/index.tpl');

        $args->getSubject()
            ->get('template')
            ->addTemplateDir($this->container->getParameter('post_finance_checkout_payment.plugin_dir') . '/Resources/views/');

        if ($args->getRequest()->getActionName() === 'index') {
            $args->getSubject()
                ->View()
                ->extendsTemplate('backend/post_finance_checkout_payment_manual_tasks/app.js');
        }
    }

    public function onPreDispatchBackendOrder(\Enlight_Event_EventArgs $args)
    {
        $args->getSubject()
            ->get('template')
            ->addTemplateDir($this->container->getParameter('post_finance_checkout_payment.plugin_dir') . '/Resources/views/');
        $args->getSubject()
            ->get('snippets')
            ->addConfigDir($this->container->getParameter('post_finance_checkout_payment.plugin_dir') . '/Resources/snippets/');
    }

    public function onPostDispatchBackendOrder(\Enlight_Event_EventArgs $args)
    {
        switch ($args->getRequest()->getActionName()) {
            case 'index':
                $args->getSubject()
                    ->View()
                    ->extendsTemplate('backend/post_finance_checkout_payment_order/app.js');
                break;
            case 'load':
                $args->getSubject()
                    ->View()
                    ->extendsTemplate('backend/post_finance_checkout_payment_order/view/window.js');
                $args->getSubject()
                    ->View()
                    ->extendsTemplate('backend/post_finance_checkout_payment_order/model/order.js');
                break;
            case 'getList':
                /* @var Plugin $plugin */
                $plugin = $this->modelManager->getRepository(Plugin::class)->findOneBy([
                    'name' => $this->container->getParameter('post_finance_checkout_payment.plugin_name')
                ]);
                $result = $args->getSubject()
                    ->View()
                    ->getAssign();
                if ($result['success'] == false) {
                    return;
                }
                $data = $result['data'];
                foreach ($data as $key => $order) {
                    $payment = Shopware()->Models()
                        ->getRepository(Payment::class)
                        ->find($order['paymentId']);
                    if ($payment instanceof Payment) {
                        $data[$key]['postfinancecheckout_payment'] = ($payment->getPluginId() == $plugin->getId());
                    }
                }
                $args->getSubject()
                    ->View()
                    ->clearAssign();
                $args->getSubject()
                    ->View()
                    ->assign(array(
                    'success' => true,
                    'data' => $data,
                    'total' => $result['total']
                ));
                break;
        }
    }
}
