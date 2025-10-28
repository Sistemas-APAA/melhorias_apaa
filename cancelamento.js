/**
 * @NApiVersion 2.0
 * @NscriptType UserEventScript
 * @NMdoleScope Public
 */

define(['N/ui/serverWidget'], function (serverWidget) {
    function beforeLoad(context) {
        if (context.type == context.UserEventType.VIEW || context.type == context.UserEventType.EDIT) {
            var form = context.form;
           var status = context.newRecord.getText({ fieldId: 'Nome_do_campo' });

            if(status == 'Cancelado'){
                var javaScript = form.addField({
                    id: 'custpage_javascript',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Altera Status'
                });
    
                javaScript.defaultValue = '<script>document.getElementsByClassName("uir-record-status")[0].setAttribute("id", "statusDoRegistro");'
                    + 'document.getElementById("statusDoRegistro").innerHTML = "' + status + '" </script>'
    
    
            }
        }
    }
    return { beforeLoad: beforeLoad }
})