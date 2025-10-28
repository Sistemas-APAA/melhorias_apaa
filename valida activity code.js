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
                fieldId: 'custcol_activity_code' // Substitua com o ID do campo "Activity code"
            });

            if (!activityCode) {
                alert("O campo 'Activity code' é obrigatório.");
                return false; // Impede a mudança para a próxima linha
            }
        }

        return true; // Permite a mudança para a próxima linha
    }

    return {
        validateLine: validateLine
    };
});
