/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    
    (search) => {
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
            const currentRecord = context.newRecord;
            const type = context.type
            if (type == context.UserEventType.CREATE || type == context.UserEventType.COPY) {
                const action = currentRecord.getValue({ fieldId: 'custevent_bit_acao_relacionada' });
                _addLines(currentRecord, action);
            };
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

        function _addLines(currentRecord, idAction) {
            try {
                let i = 0;
                search.create({
                    type: "customrecord_bit_linhas_acao",
                    filters:
                        [
                            ["custrecord_bit_link_acao", "anyof", idAction]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "name" }),
                            search.createColumn({ name: "custrecord_bit_tipoindicador" }),
                            search.createColumn({ name: "custrecord_bit_indicador_linha" }),
                            search.createColumn({ name: "custrecord_bit_at_indic" }),
                            search.createColumn({ name: "custrecord_bit_linha_realizado_estatico" }),
                            search.createColumn({ name: "custrecord_bit_ling_artist" }),
                            search.createColumn({ name: "custrecord_bit_classif_indic" }),
                            search.createColumn({ name: "custrecord_bit_qnt_art_linha" }),
                            search.createColumn({ name: "custrecord_bit_qnt_prof_linha" }),
                            search.createColumn({ name: "custrecord_bit_duracao_min_linha" }),
                            search.createColumn({ name: "custrecord_bit_paga_gratuita_linha" }),
                            search.createColumn({ name: "custrecord_bit_tipo_publico_linha" }),
                            search.createColumn({ name: "custrecordbit_linha_acess_com" }),
                            search.createColumn({ name: "custrecord_bit_linha_parceria" }),
                            search.createColumn({ name: "custrecord_bit_linha_pactua" }),
                            // search.createColumn({ name: "custrecord_bit_linha_acessoriacom" }),
                            search.createColumn({ name: "custrecord_bit_linha_release" }),
                            search.createColumn({ name: "internalid" }),
                            search.createColumn({ name: "custrecord_bit_planejado_l_acao" })
                        ]
                }).run().getRange({ start: 0, end: 1000 }).forEach(function (result) {
                    log.debug('line', i)
                    currentRecord.insertLine({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', line: i });
                    currentRecord.setSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_n_indicador', value: result.getValue(result.columns[16]), line: i })
                    currentRecord.setSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_tipo_indc', value: result.getValue(result.columns[1]), line: i });
                    currentRecord.setSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_indicador', value: result.getValue(result.columns[2]), line: i });
                    currentRecord.setSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_atributo_indicador', value: result.getValue(result.columns[3]), line: i });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_lingart', value: result.getValue(result.columns[5]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_classind', value: result.getValue(result.columns[6]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_qntart', value: result.getValue(result.columns[7]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_qntprof', value: result.getValue(result.columns[8]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_duracaomin', value: result.getValue(result.columns[9]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_pg', value: result.getValue(result.columns[10]) });
                    currentRecord.setSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_meta_da_acao', value: result.getValue(result.columns[17]), line: i });
                    currentRecord.setSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_acao', value: result.getValue(result.columns[4]), line: i });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_tipo_public_realizado', value: result.getValue(result.columns[11]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_acess_comunicacional_', value: result.getValue(result.columns[12]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_parceria_realizado', value: result.getValue(result.columns[13]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_pactua_realizado', value: result.getValue(result.columns[14]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_acess_comu_realizado', value: result.getValue(result.columns[15]) });
                    // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_release', value: result.getValue(result.columns[16]) });
                    // currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_link_meta_realizado' });
                    i += 1;
                });

            } catch (err) {
                log.error('Erro no before submit', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
            }
        };


        return {
            // beforeLoad,
            beforeSubmit,
            // afterSubmit
        }

    });
