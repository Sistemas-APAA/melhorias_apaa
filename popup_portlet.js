/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/ui/serverWidget'], function (serverWidget) {
    function render(params) {
        params.portlet.clientScriptModulePath = './popup_client.js'; // Caminho do Client Script
        params.portlet.title = 'Avisos de Contratos'; // Apenas um título para o portlet
    }
    return { render };
});
