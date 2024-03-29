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

namespace PostFinanceCheckoutPayment\Components\Provider;

use PostFinanceCheckoutPayment\Components\ApiClient;

/**
 * Provider of language information from the gateway.
 */
class Language extends AbstractProvider
{
    public function __construct(ApiClient $apiClient, \Zend_Cache_Core $cache)
    {
        parent::__construct($apiClient->getInstance(), $cache, 'postfinancecheckout_payment_languages');
    }

    /**
     * Returns the language by the given code.
     *
     * @param int $code
     * @return \PostFinanceCheckout\Sdk\Model\RestLanguage
     */
    public function find($code)
    {
        return parent::find($code);
    }

    /**
     * Returns the primary language in the given group.
     *
     * @param string $code
     * @return \PostFinanceCheckout\Sdk\Model\RestLanguage
     */
    public function findPrimary($code)
    {
        $code = substr($code, 0, 2);
        foreach ($this->getAll() as $language) {
            if ($language->getIso2Code() == $code && $language->getPrimaryOfGroup()) {
                return $language;
            }
        }

        return false;
    }

    /**
     * Returns a list of languages.
     *
     * @return \PostFinanceCheckout\Sdk\Model\RestLanguage[]
     */
    public function getAll()
    {
        return parent::getAll();
    }

    protected function fetchData()
    {
        $methodService = new \PostFinanceCheckout\Sdk\Service\LanguageService($this->apiClient);
        return $methodService->all();
    }

    protected function getId($entry)
    {
        /* @var \PostFinanceCheckout\Sdk\Model\RestLanguage $entry */
        return $entry->getIetfCode();
    }
}
