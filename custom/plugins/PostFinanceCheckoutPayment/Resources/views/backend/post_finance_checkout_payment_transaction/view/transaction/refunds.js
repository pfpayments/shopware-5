/**
 * PostFinance Checkout Shopware 5
 *
 * This Shopware 5 extension enables to process payments with PostFinance Checkout (https://postfinance.ch/en/business/products/e-commerce/postfinance-checkout-all-in-one.html/).
 *
 * @package PostFinanceCheckout_Payment
 * @author wallee AG (http://www.wallee.com/)
 * @license http://www.apache.org/licenses/LICENSE-2.0  Apache Software License (ASL 2.0)
 */

//{block name="backend/postfinancecheckout_payment_transaction/view/transaction/refunds"}
//{namespace name=backend/postfinancecheckout_payment/main}
Ext.define('Shopware.apps.PostFinanceCheckoutPaymentTransaction.view.transaction.Refunds', {

    extend: 'Ext.panel.Panel',

    alias: 'widget.postfinancecheckout-payment-transaction-refunds',

    cls: 'shopware-form',

    autoScroll: true,

    bodyPadding: 0,

    border: 0,

    layout: 'fit',

    snippets: {
        button: {
            create: '{s name="refund/button/create"}Create Refund{/s}'
        }
    },

    initComponent: function() {
        var me = this;
        me.registerEvents();
        me.items = me.getItems();
        me.dockedItems = me.createToolbar();
        me.callParent(arguments);
    },
    
    registerEvents: function() {
        this.addEvents(
            'createRefund'
        );
    },
    
    getItems: function() {
        var me = this;
        
        var items = [
            Ext.create('Ext.container.Container', {
                layout: 'border',
                region: 'center',
                items: [ me.createGrid(), me.createDetail() ]
            })
        ];
        
        return items;
    },
    
    createGrid: function() {
        var me = this;
        
        var grid = Ext.create('Shopware.apps.PostFinanceCheckoutPaymentTransaction.view.transaction.Refunds.Grid', {
            record: me.record,
            store: me.record.getRefunds(),
            region: 'center',
            style: {
                borderTop: '1px solid #A4B5C0'
            },
            viewConfig: {
                enableTextSelection: false
            }
        });
        
        return grid;
    },
    
    createDetail: function() {
        var me = this;
        
        var detail = Ext.create('Shopware.apps.PostFinanceCheckoutPaymentTransaction.view.transaction.Refunds.Details', {
            region: 'east',
            width: '50%',
            transaction: me.record
        });
        
        return detail;
    },
    
    createToolbar: function() {
        var me = this,
            toolbar = [];
        
        var buttons = me.createButtons();
        if (buttons.length > 1) {
            toolbar.push({
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                border: 0,
                defaults: {
                    xtype: 'button'
                },
                items: buttons
            });
        }

        return toolbar;
    },
    
    createButtons: function() {
        var me = this;
        
        var buttons = [{ xtype: 'component', flex: 1 }];
        
        if (me.record.get('canRefund')) {
            buttons.push({
                text: me.snippets.button.create,
                action: 'createRefund',
                cls: 'primary',
                handler: function() {
                    me.fireEvent('createRefund', me.record);
                }
            });
        }
        
        return buttons;
    }
    
});
//{/block}