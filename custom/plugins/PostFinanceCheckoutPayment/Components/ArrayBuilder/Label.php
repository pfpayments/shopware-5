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

namespace PostFinanceCheckoutPayment\Components\ArrayBuilder;

use Symfony\Component\DependencyInjection\ContainerInterface;
use PostFinanceCheckout\Sdk\Model\LabelDescriptor;

class Label extends AbstractArrayBuilder
{
    /**
     *
     * @var LabelDescriptor
     */
    private $descriptor;

    /**
     *
     * @var string
     */
    private $value;

    /**
     * Constructor.
     *
     * @param ContainerInterface $container
     * @param LabelDescriptor $descriptor
     * @param string $value
     */
    public function __construct(ContainerInterface $container, LabelDescriptor $descriptor, $value)
    {
        parent::__construct($container);
        $this->descriptor = $descriptor;
        $this->value = $value;
    }

    /**
     *
     * @return \PostFinanceCheckout\Sdk\Model\LabelDescriptor
     */
    public function getDescriptor()
    {
        return $this->descriptor;
    }

    public function build()
    {
        return [
            'descriptor' => [
                'id' => $this->descriptor->getId(),
                'name' => $this->translate($this->descriptor->getName()),
                'description' => $this->translate($this->descriptor->getDescription()),
                'weight' => $this->descriptor->getWeight()
            ],
            'value' => $this->value
        ];
    }
}
