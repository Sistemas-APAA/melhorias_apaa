/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/runtime', 'N/ui/dialog'],
    /**
 * @param{record} record
 */
    (record, runtime, dialog) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} context
         * @param {Record} context.newRecord - New record
         * @param {string} context.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} context.form - Current form
         * @param {ServletRequest} context.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (context) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} context
         * @param {Record} context.newRecord - New record
         * @param {Record} context.oldRecord - Old record
         * @param {string} context.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (context) => {
            const newRecord = context.newRecord;
            const actionRecordId = newRecord.getValue({
                fieldId: 'custrecord_bit_link_acao'
            });
            const actionRecord = record.load({
                type: 'customrecord_bit_acao_rt',
                id: actionRecordId,
                isDynamic: true
            });

            // const lineNum = currentRecord.getCurrentSublistValue({
            //     sublistId: sublistId,
            //     filedId: 'line'
            // });
            const currentScript = runtime.getCurrentScript();
            const parameterStatus = currentScript.getParameter({ name: 'custscript_bit_id_indicador_meta_ue' });
            const parameterAtributo = currentScript.getParameter({ name: 'custscript_bit_id_atributo_ue' });

            var fieldAcao = actionRecord.getValue({ fieldId: 'custrecord_bit_checkbox_totaliza' });

            // currentRecord.selectLine({ sublistId: 'recmachcustrecord_bit_link_acao', line: lineNum });
            var valueField = newRecord.getValue({ fieldId: 'custrecord_bit_linha_realizado_estatico' });
            var indicador = newRecord.getValue({ fieldId: 'custrecord_bit_tipoindicador' });
            var atributo = newRecord.getValue({ fieldId: 'custrecord_bit_at_indic' });

            if (!fieldAcao && valueField || indicador != parameterStatus || atributo != parameterAtributo) {
                dialog.alert({
                    title: 'Alerta!',
                    message: 'Não é possível preencher, pois a ação não é totalizadora <b>ou</b> o atributo não é meta-produto.'
                });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_linha_realizado_estatico', value: '', ignoreFieldChange: true });
                return false
            }

            if (fieldAcao && valueField != 1 && atributo == parameterAtributo && indicador == parameterStatus) {
                dialog.alert({
                    title: 'Alerta!',
                    message: 'Não é possível preencher com um valor diferente de 1.'
                });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_linha_realizado_estatico', value: '', ignoreFieldChange: true });
                return false
            }
            // currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_link_acao' });
            return true

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} context
         * @param {Record} context.newRecord - New record
         * @param {Record} context.oldRecord - Old record
         * @param {string} context.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (context) => {

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
