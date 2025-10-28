/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord'], (currentRecord) => {
    const fieldChanged = (context) => {
        let requisition = currentRecord.get();
        if (context.fieldId === 'memo') {
            requisition.setValue({ fieldId: 'subsidiary', value: '' });
        }
    };

    return { fieldChanged };
});
