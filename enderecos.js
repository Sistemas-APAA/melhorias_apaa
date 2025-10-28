/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define([], function() {

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;
        var fieldId = context.fieldId;

        try {
            if (fieldId === 'zip') {
                var zip = currentRecord.getValue({ fieldId: 'zip' });
                if (zip) {
                    var cleaned = zip.replace(/[.\-]/g, ''); // remove pontos e traços
                    if (zip !== cleaned) {
                        currentRecord.setValue({ fieldId: 'zip', value: cleaned });
                    }
                }
            }
            if (fieldId === 'addr2') {
                var bairro = currentRecord.getValue({ fieldId: 'addr2' });
                if (bairro && bairro.length > 30) {
                    var truncated = bairro.substring(0, 30);
                    currentRecord.setValue({ fieldId: 'addr2', value: truncated });
                    alert("O campo Bairro foi limitado a 30 caracteres.");
                }
            }
            if (fieldId === 'addr3') {
                var numero = currentRecord.getValue({ fieldId: 'addr3' });
                if (numero && numero.length > 5) {
                    var truncated = numero.substring(0, 5);
                    currentRecord.setValue({ fieldId: 'addr3', value: truncated });
                    alert("O campo numero foi limitado a 5 caracteres.");
                }
            }
        } catch (e) {
            alert('Erro ao processar campo: ' + e.message);
        }
    }
    return {
        fieldChanged: fieldChanged
    };
});