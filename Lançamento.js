/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define([], function() {

    function validateLine(context) {
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;

        if (sublistName === 'item') {
            var activityCode = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'cseg_paactivitycode' // Substitua com o ID do campo "Activity code"
            });
            var customer = currentRecord.getCurrentSublistValue({
              sublistId: 'item',
              fieldId: 'customer'
            });
            var fonte = currentRecord.getCurrentSublistValue({
              sublistId: 'item',
              fieldId: 'cseg_bit_fonte_rec'
            });
            if (!customer) {
              alert("O campo Projeto na linha do item é obrigatório");
              return false;
            }

            if (!activityCode) {
                alert("O campo 'Activity code' é obrigatório.");
                return false; // Impede a mudança para a próxima linha
            }

            if (!fonte) {
                alert("O campo 'Fonte de recurso' é obrigatório.");
                return false; // Impede a mudança para a próxima linha
            }
        }
        if (sublistName === 'line') {
            var activityCode = currentRecord.getCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'cseg_paactivitycode' // Substitua com o ID do campo "Activity code"
            });
            var customer = currentRecord.getCurrentSublistValue({
              sublistId: 'line',
              fieldId: 'customer'
            });
            var class = currentRecord.getCurrentSublistValue({
              sublistId: 'line',
              fieldId: 'class'
            });
            var fonte = currentRecord.getCurrentSublistValue({
              sublistId: 'line',
              fieldId: 'cseg_bit_fonte_rec'
            });
            if (!customer) {
              alert("O campo Projeto na linha do item é obrigatório");
              return false;
            }
            if (!class) {
              alert("O Centro de custos na linha do item é obrigatório");
              return false;
            }

            if (!activityCode) {
                alert("O campo 'Activity code' é obrigatório.");
                return false; // Impede a mudança para a próxima linha
            }

            if (!fonte) {
                alert("O campo 'Fonte de recurso' é obrigatório.");
                return false; // Impede a mudança para a próxima linha
            }
        }

        return true; // Permite a mudança para a próxima linha
    }

    return {
        validateLine: validateLine
    };
});