/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/runtime', 'N/ui/serverWidget'], (runtime, serverWidget) => {
    function beforeLoad(context) {
        if (context.type !== context.UserEventType.VIEW) return;

        var form = context.form;
        form.clientScriptModulePath = './popup.js'; // Caminho do Client Script
    }

    return { beforeLoad };
});
