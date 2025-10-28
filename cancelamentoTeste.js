/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/log'],
    function(record, search, serverWidget, log) {
        function onAction(scriptContext) 
            {
                if (context.type == context.UserEventType.VIEW || context.type == context.UserEventType.EDIT) {
                    var form = context.form;
                   var status = context.newRecord.getText({ fieldId: 'custbody_bit_body_status_cot' });
        
                    if(status != ''){
                        var javaScript = form.addField({
                            id: 'custpage_javascript',
                            type: serverWidget.FieldType.INLINEHTML,
                            label: 'Altera Status'
                        });
            
                        javaScript.defaultValue = '<script>document.getElementsByClassName("uir-record-status")[0].setAttribute("id", "custbody_bit_body_status_cot");'
                            + 'document.getElementById("custbody_bit_body_status_cot").innerHTML = "' + status + '" </script>'
            
            
                    }
                }
            }

        return {
            onAction: onAction
        };
    });
