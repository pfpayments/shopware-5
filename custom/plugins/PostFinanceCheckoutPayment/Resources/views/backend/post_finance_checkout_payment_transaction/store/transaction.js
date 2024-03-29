/**
 * PostFinance Checkout Shopware 5
 *
 * This Shopware 5 extension enables to process payments with PostFinance Checkout (https://postfinance.ch/en/business/products/e-commerce/postfinance-checkout-all-in-one.html/).
 *
 * @package PostFinanceCheckout_Payment
 * @author wallee AG (http://www.wallee.com/)
 * @license http://www.apache.org/licenses/LICENSE-2.0  Apache Software License (ASL 2.0)
 */

//{block name="backend/postfinancecheckout_payment_transaction/store/transaction"}
Ext.define('Shopware.apps.PostFinanceCheckoutPaymentTransaction.store.Transaction', {

    extend: 'Ext.data.Store',
 
    autoLoad: false,
    
    sorters: [{
		property : 'transactionId',
		direction: 'DESC'
	}],
 
    model: 'Shopware.apps.PostFinanceCheckoutPaymentTransaction.model.Transaction'
        
});
//{/block}