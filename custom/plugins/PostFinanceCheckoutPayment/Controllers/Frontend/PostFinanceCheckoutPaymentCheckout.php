<?php

/**
 * PostFinance Checkout Shopware
 *
 * This Shopware extension enables to process payments with PostFinance Checkout (https://www.postfinance.ch/).
 *
 * @package PostFinanceCheckout_Payment
 * @author customweb GmbH (http://www.customweb.com/)
 * @license http://www.apache.org/licenses/LICENSE-2.0  Apache Software License (ASL 2.0)
 */

class Shopware_Controllers_Frontend_PostFinanceCheckoutPaymentCheckout extends Shopware_Controllers_Frontend_Checkout
{
    private $_orderNumber;
    
    public function preDispatch()
    {
        parent::preDispatch();

        if (in_array($this->Request()->getActionName(), [
            'saveOrder'
        ])) {
            $this->Front()
                ->Plugins()
                ->ViewRenderer()
                ->setNoRender();
        }
    }

    public function saveOrderAction()
    {
        ob_start();
        $this->_orderNumber = null;
        $backup = $this->get('postfinancecheckout_payment.basket')->backupBasket();
        $this->finishAction();
        $this->get('postfinancecheckout_payment.basket')->restoreBasket($backup);
        if ($this->_orderNumber != null) {
            $this->get('postfinancecheckout_payment.registry')->set('disable_risk_management', true);
            $this->get('modules')->Order()->sCreateTemporaryOrder();
            ob_clean();
            echo json_encode([
                'result' => 'success'
            ]);
        }
        ob_end_flush();
    }
    
    public function saveOrder()
    {
        $orderNumber = parent::saveOrder();
        $this->_orderNumber = $orderNumber;
        return $orderNumber;
    }

    public function forward($action, $controller = null, $module = null, array $params = null)
    {
    }
}
