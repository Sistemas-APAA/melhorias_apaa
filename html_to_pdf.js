/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/render', 'N/record', 'N/file'], function (render, record, file) {

    function onRequest(context) {
        var request = context.request;
        var response = context.response;
        
        var recordId = request.parameters.recordId;

        if (recordId) {
            var recordObj = record.load({
                type: record.Type.PURCHASE_REQUISITION, // Substitua pelo tipo de transação apropriado
                id: recordId
            });

            // Aqui você pode gerar seu conteúdo HTML dinamicamente
            var htmlContent = '<html><body><h1>Ordem de Compra #' + recordId + '</h1><p>Conteúdo da ordem de compra...</p></body></html>';

            // Renderiza o HTML como PDF
            var pdfFile = render.xmlToPdf({
                xmlString: htmlContent
            });

            // Defina o nome e tipo do arquivo para a resposta
            response.writeFile({
                file: pdfFile,
                isInline: true // Abre diretamente no navegador
            });
        }
    }

    return {
        onRequest: onRequest
    };
});
