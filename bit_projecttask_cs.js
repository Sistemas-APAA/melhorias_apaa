/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define([
    'N/search',
    'N/record',
    'N/runtime',
    'N/ui/dialog'
],
    function (
        search,
        record,
        runtime,
        dialog
    ) {

        function lineInit(context) {
            if (context.sublistId == 'recmachcustrecord_bit_link_meta_realizado') {
                const currentRecord = context.currentRecord;
                const valueColumn = currentRecord.getCurrentSublistText({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_n_indicador' })

                if (valueColumn == 'LINGUAGEM ARTÍSTICA') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_lingart' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_realizado_lingart'
                        ])
                    }

                } else if (valueColumn == 'CLASSIFICAÇÃO INDICATIVA') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_classind' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_realizado_classind'
                        ])
                    }
                } else if (valueColumn == 'QUANTIDADE ARTÍSTAS') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_qntart' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_realizado_qntart'
                        ])
                    }

                } else if (valueColumn == 'QUANTIDADE PROFISSIONAIS') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_qntprof' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_realizado_qntprof'
                        ])
                    }

                } else if (valueColumn == 'DURAÇÃO MINUTOS') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_duracaomin' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_realizado_duracaomin'
                        ])
                    }

                } else if (valueColumn == 'PAGA OU GRATUITA') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_pg' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_realizado_pg'
                        ])
                    }
                } else if (valueColumn == 'RELEASE') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_release' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_realizado_release'
                        ])
                    }
                } else if (valueColumn == 'TIPO PÚBLICO') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_tipo_public_realizado' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_tipo_public_realizado'
                        ])
                    }
                } else if (valueColumn == 'ACESS COMUNICACIONAL') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_acess_comunicacional_' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_acess_comunicacional_'
                        ])
                    }
                } else if (valueColumn == 'PARCERIA') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_parceria_realizado' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_parceria_realizado'
                        ])
                    }

                } else if (valueColumn == 'PACTUA') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_pactua_realizado' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_pactua_realizado'
                        ])
                    }

                } else if (valueColumn == 'ACESSORIA COMUNICAÇÃO') {
                    _disableAllColumns(currentRecord);

                    var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_acess_comu_realizado' });
                    if (!field) {
                        _enableColumns(currentRecord, [
                            'custrecord_bit_acess_comu_realizado'
                        ])
                    }

                } else {
                    const currentScript = runtime.getCurrentScript();
                    const parameterStatus = currentScript.getParameter({ name: 'custscript_bit_meta_produto' });

                    var action = currentRecord.getValue({ fieldId: 'custevent_bit_acao_relacionada' });
                    if (action) {
                        var isTotalizadora = _get(action);
                        var field = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_atributo_indicador' });
                        _disableAllColumns(currentRecord);
    
                        log.debug('field', field)
                        log.debug('parameterStatus', parameterStatus)
    
                        if (!isTotalizadora || field != parameterStatus) {
                            _enableColumns(currentRecord, [
                                'custrecord_bit_realizado_acao',
                                'custrecord_bit_meta_da_acao'
                            ])
                        }
                    }
                }
            }
        };

        function fieldChanged(context) {
            const currentRecord = context.currentRecord;
            const fieldId = context.fieldId;

            if (fieldId == 'custevent_bit_acao_relacionada') {
                const action = currentRecord.getValue({ fieldId: 'custevent_bit_acao_relacionada' });
                log.debug('action', action);
                log.debug('action Length', action.length);
                const lines = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_link_meta_realizado' });

                if (lines > 0) {
                    _removeLines(currentRecord, lines);
                };

                if (action) {
                    _addLines(currentRecord, action);
                };
            };
        };

        function _get(action) {
            var field = '';

            search.create({
                type: "customrecord_bit_acao_rt",
                filters:
                    [
                        ["internalid", "is", action]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_bit_checkbox_totaliza" }),

                    ]
            }).run().getRange({ start: 0, end: 1000 }).forEach(function (result) {
                field = result.getValue(result.columns[0])
            });

            return field;
        }

        function _disableAllColumns(currentRecord) {
            const lineSublist = currentRecord.getSublist({ sublistId: 'recmachcustrecord_bit_link_meta_realizado' });
            // const fields = [
            //     'custrecord_bit_n_indicador', 'custrecord_bit_tipo_indc', 'custrecord_bit_indicador',
            //     'custrecord_bit_atributo_indicador', 'custrecord_bit_meta_da_acao', 'custrecord_bit_realizado_acao',
            //     'custrecord_bit_realizado_lingart', 'custrecord_bit_realizado_classind', 'custrecord_bit_realizado_qntart',
            //     'custrecord_bit_realizado_qntprof', 'custrecord_bit_realizado_duracaomin', 'custrecord_bit_realizado_pg',
            //     'custrecord_bit_realizado_release', 'custrecord_bit_tipo_public_realizado', 'custrecord_bit_acess_comunicacional_',
            //     'custrecord_bit_parceria_realizado', 'custrecord_bit_pactua_realizado', 'custrecord_bit_acess_comu_realizado'
            // ]

            const fields = [
                'custrecord_bit_n_indicador', 'custrecord_bit_tipo_indc', 'custrecord_bit_indicador',
                'custrecord_bit_atributo_indicador', 'custrecord_bit_meta_da_acao', 'custrecord_bit_realizado_acao'
            ]

            for (var i = 0; i < fields.length; i++) {
                var column = lineSublist.getColumn({ fieldId: fields[i] });
                column.isDisabled = true;
            }
        }

        function _enableColumns(currentRecord, fields) {
            const lineSublist = currentRecord.getSublist({ sublistId: 'recmachcustrecord_bit_link_meta_realizado' });

            for (var i = 0; i < fields.length; i++) {
                var column = lineSublist.getColumn({ fieldId: fields[i] });
                column.isDisabled = false;
            }
        }

        function _addLines(currentRecord, idAction) {

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

                currentRecord.selectNewLine({ sublistId: 'recmachcustrecord_bit_link_meta_realizado' });
                currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_n_indicador', value: result.getValue(result.columns[16]) })
                currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_tipo_indc', value: result.getValue(result.columns[1]) });
                currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_indicador', value: result.getValue(result.columns[2]) });
                currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_atributo_indicador', value: result.getValue(result.columns[3]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_lingart', value: result.getValue(result.columns[5]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_classind', value: result.getValue(result.columns[6]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_qntart', value: result.getValue(result.columns[7]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_qntprof', value: result.getValue(result.columns[8]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_duracaomin', value: result.getValue(result.columns[9]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_pg', value: result.getValue(result.columns[10]) });
                currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_meta_da_acao', value: result.getValue(result.columns[17]) });
                currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_acao', value: result.getValue(result.columns[4]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_tipo_public_realizado', value: result.getValue(result.columns[11]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_acess_comunicacional_', value: result.getValue(result.columns[12]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_parceria_realizado', value: result.getValue(result.columns[13]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_pactua_realizado', value: result.getValue(result.columns[14]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_acess_comu_realizado', value: result.getValue(result.columns[15]) });
                // currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_meta_realizado', fieldId: 'custrecord_bit_realizado_release', value: result.getValue(result.columns[16]) });
                currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_link_meta_realizado' });
            });
        };

        function _removeLines(currentRecord, _lengthLine) {
            for (var i = 0; i < _lengthLine; i++) {
                currentRecord.removeLine({
                    sublistId: 'recmachcustrecord_bit_link_meta_realizado',
                    line: 0,
                    ignoreRecalc: true
                });
            }
        };

        return {
            lineInit: lineInit,
            fieldChanged: fieldChanged
        };
    });