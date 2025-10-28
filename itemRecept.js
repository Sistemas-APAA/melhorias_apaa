/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/url'], function(currentRecord, url) {

    function pageInit(context) {
        var rec = currentRecord.get();
        var urlParams = new URL(window.location.href);
        var itemrcpt = urlParams.searchParams.get("itemrcpt");

        if (itemrcpt) {
            rec.setValue({
                fieldId: 'custbody_item_receipt_id', // campo personalizado que você deve criar
                value: itemrcpt
            });
        }
    }

    return {
        pageInit: pageInit
    };
});
