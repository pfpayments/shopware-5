/**
 * PostFinance Checkout Shopware 5
 *
 * This Shopware 5 extension enables to process payments with PostFinance Checkout (https://postfinance.ch/en/business/products/e-commerce/postfinance-checkout-all-in-one.html/).
 *
 * @package PostFinanceCheckout_Payment
 * @author wallee AG (http://www.wallee.com/)
 * @license http://www.apache.org/licenses/LICENSE-2.0  Apache Software License (ASL 2.0)
 */

//{block name="backend/postfinancecheckout_payment_transaction/view/transaction/refunds/grid"}
//{namespace name=backend/postfinancecheckout_payment/main}
Ext.define('Shopware.apps.PostFinanceCheckoutPaymentTransaction.view.transaction.Refunds.Grid', {

    extend: 'Ext.grid.Panel',

    alias: 'widget.postfinancecheckout-payment-transaction-refunds-grid',

    minHeight: 90,

    autoScroll: true,

    snippets: {
        state: '{s name="refund/field/state"}State{/s}',
        id: '{s name="refund/field/id"}ID{/s}',
        createdOn: '{s name="refund/field/created_on"}Created On{/s}',
        amount: '{s name="refund/field/amount"}Amount{/s}',
        detail: '{s name="refund/field/details"}Details{/s}',
    },

    viewConfig: {
        enableTextSelection: true
    },

    registerEvents: function() {
        this.addEvents(
            'showDetail'
        );
    },

    initComponent: function() {
        var me = this;
        me.columns = me.getColumns();

        me.getSelectionModel().on('selectionchange', function(row, selection, options) {
            me.fireEvent('showDetail', selection[0], me);
        });

        me.callParent(arguments);
    },

    getColumns: function() {
        var me = this;

        var columns = [
            {
                header: me.snippets.state,
                dataIndex: 'state',
                width: 30,
                renderer: me.stateRenderer
            },
            {
                header: me.snippets.id,
                dataIndex: 'id',
                flex: 1
            },
            {
                header: me.snippets.createdOn,
                dataIndex: 'createdOn',
                flex: 2,
                renderer: me.dateRenderer
            },
            {
                header: me.snippets.amount,
                dataIndex: 'amount',
                flex: 1,
                renderer: me.amountRenderer
            }
        ];
        
        return columns;
    },
    
    dateRenderer: function(value) {
        if (value === Ext.undefined) {
            return value;
        }
        return Ext.util.Format.date(value) + ' ' + Ext.util.Format.date(value, timeFormat);
    },
    
    amountRenderer: function(value) {
        var me = this;
        
        if (value === Ext.undefined) {
            return value;
        }
        return Ext.util.Format.currency(value, null, me.record.get('currencyDecimals'));
    },

    stateRenderer: function(value) {
        var me = this;
        
        switch (value) {
        case 'SUCCESSFUL':
            return '<div class="sprite-tick postfinancecheckout-payment-refund-column-icon"></div>';
        case 'FAILED':
            return '<div class="sprite-cross postfinancecheckout-payment-refund-column-icon"></div>';
        case 'MANUAL_CHECK':
            return '<div class="sprite-exclamation postfinancecheckout-payment-refund-column-icon"></div>';
        case 'PENDING':
            return '<div class="sprite-arrow-circle-double postfinancecheckout-payment-refund-column-icon"></div>';
        }
    }
    
});
//{/block}