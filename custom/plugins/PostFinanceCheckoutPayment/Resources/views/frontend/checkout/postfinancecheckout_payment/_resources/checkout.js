/**
 * PostFinance Checkout Shopware
 *
 * This Shopware extension enables to process payments with PostFinance Checkout (https://www.postfinance.ch/).
 *
 * @package PostFinanceCheckout_Payment
 * @author customweb GmbH (http://www.customweb.com/)
 * @license http://www.apache.org/licenses/LICENSE-2.0  Apache Software License (ASL 2.0)
 */

if (typeof ShopwarePostFinanceCheckout == 'undefined') {
    var ShopwarePostFinanceCheckout = {};
}

ShopwarePostFinanceCheckout.Checkout = {
    handler : null,
    checkoutButtonBackup: null,
    blockSubmit: false,

    init : function(container, configurationId, saveOrderUrl) {
        this.checkoutButtonBackup = $('button[form="confirm--form"]').html();
        
        this.attachListeners();
        this.createHandler(container, configurationId, saveOrderUrl);
    },
    
    attachListeners: function(){
        $('#confirm--form').on('submit.postfinancecheckout_payment', $.proxy(function(event){
            this.onSubmit();
            event.preventDefault();
            return false;
        }, this));
    },
    
    onSubmit: function(){
        if (!this.blockSubmit) {
        	this.blockSubmit = true;
        	this.handler.validate();
    	}
    },

    createHandler : function(container, configurationId, saveOrderUrl) {
        this.blockCheckoutButton();
        if (!this.handler) {
            this.handler = window.IframeCheckoutHandler(configurationId);
            this.handler.setHeightChangeCallback(function(height){
            		if (height > 0) {
            			$('#postfinancecheckout_payment_method_form_container').css({
            				position: 'static',
            				left: 'auto'
            			});
                }
            });
            this.handler.create(container, $.proxy(function(validationResult) {
            		this.hideErrors();
                if (validationResult.success) {
                    $.ajax({
                        url: saveOrderUrl,
                        data: $('#confirm--form').serializeArray(),
                        dataType: 'json',
                        method: 'POST',
                        success: $.proxy(function(response){
                        		if (response.result == 'success') {
                        			this.handler.submit();
                        		} else {
                        			window.location.reload();
                        		}
                        }, this),
                        error: function(){
                        		window.location.reload();
                        }
                    });
                } else {
                    $(window).scrollTop($('#' + container).offset().top);
            		if (validationResult.errors) {
            			this.showErrors(validationResult.errors);
            		}
                    this.unblockCheckoutButton();
                    this.blockSubmit = false;
                }
            }, this), $.proxy(function() {
                this.unblockCheckoutButton();
            }, this));
        }
    },
    
    wrap: function(object, functionName, wrapper){
        var originalFunction = $.proxy(object[functionName], object);
        return function(){
            var args = Array.prototype.slice.call(arguments);
            args.unshift(originalFunction);
            return wrapper.apply(object, args);
        };
    },
    
    showErrors: function(errors){
    		var element = $('.postfinancecheckout-payment-validation-failure-message');
        element.find('.alert--list').html('');
        $.each(errors, function(index, error){
            element.find('.alert--list').append('<li class="list--entry">' + error + '</li>');
        });
        element.show();
        $(window).scrollTop(0);
    },
    
    hideErrors: function(){
    		var element = $('.postfinancecheckout-payment-validation-failure-message');
    		element.hide();
    },
    
    blockCheckoutButton: function(){
        var element = $('button[form="confirm--form"]'),
            instance = element.data('plugin_swPreloaderButton'),
            checkFormIsValidBackup = instance.opts.checkFormIsValid;
        
        instance.opts.checkFormIsValid = false;
        instance.onShowPreloader();
        instance.opts.checkFormIsValid = checkFormIsValidBackup;
    },
    
    unblockCheckoutButton: function(){
        var element = $('button[form="confirm--form"]'),
            instance = element.data('plugin_swPreloaderButton');
        window.setTimeout($.proxy(function() {
            element.removeAttr('disabled').find('.' + instance.opts.loaderCls).remove();
            element.html(this.checkoutButtonBackup);
        }, this), 25);
    }
};