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
        function fieldChanged(context) {
            const currentRecord = context.currentRecord;
            const fieldId = context.fieldId;
            const lineNum = context.line;

            // if (fieldId == 'custrecord_bit_linga_artistica' || fieldId == 'custrecord_bit_check_ling_art') {
            //     var name = 'LINGUAGEM ARTÍSTICA';
            //     var field = 'custrecord_bit_ling_artist';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_linga_artistica' });
            //     id = fieldId == 'custrecord_bit_check_ling_art' ? '' : id;

            //     if (fieldId == 'custrecord_bit_check_ling_art' && currentRecord.getValue({ fieldId: 'custrecord_bit_check_ling_art' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_linga_artistica' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_linga_artistica' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_linga_artistica' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_check_ling_art' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_check_ling_art' && !currentRecord.getValue({ fieldId: 'custrecord_bit_linga_artistica' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_classe_idicativa' || fieldId == 'custrecord_bit_check_class_ind') {
            //     var name = 'CLASSIFICAÇÃO INDICATIVA';
            //     var field = 'custrecord_bit_classif_indic';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_classe_idicativa' });
            //     id = fieldId == 'custrecord_bit_check_class_ind' ? '' : id;

            //     if (fieldId == 'custrecord_bit_check_class_ind' && currentRecord.getValue({ fieldId: 'custrecord_bit_check_class_ind' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_classe_idicativa' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_classe_idicativa' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_classe_idicativa' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_check_class_ind' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_check_class_ind' && !currentRecord.getValue({ fieldId: 'custrecord_bit_classe_idicativa' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_qty_artistas' || fieldId == 'custrecord_bit_check_qnt_art') {
            //     var name = 'QUANTIDADE ARTÍSTAS';
            //     var field = 'custrecord_bit_qnt_art_linha';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_qty_artistas' });
            //     id = fieldId == 'custrecord_bit_check_qnt_art' ? '' : id;

            //     if (fieldId == 'custrecord_bit_check_qnt_art' && currentRecord.getValue({ fieldId: 'custrecord_bit_check_qnt_art' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_qty_artistas' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_qty_artistas' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_qty_artistas' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_check_qnt_art' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_check_qnt_art' && !currentRecord.getValue({ fieldId: 'custrecord_bit_qty_artistas' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_qty_profissionais_ativida' || fieldId == 'custrecord_bit_check_qnt_prof') {
            //     var name = 'QUANTIDADE PROFISSIONAIS';
            //     var field = 'custrecord_bit_qnt_prof_linha';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_qty_profissionais_ativida' });
            //     id = fieldId == 'custrecord_bit_check_qnt_prof' ? '' : id;

            //     if (fieldId == 'custrecord_bit_check_qnt_prof' && currentRecord.getValue({ fieldId: 'custrecord_bit_check_qnt_prof' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_qty_profissionais_ativida' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_qty_profissionais_ativida' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_qty_profissionais_ativida' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_check_qnt_prof' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_check_qnt_prof' && !currentRecord.getValue({ fieldId: 'custrecord_bit_qty_profissionais_ativida' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_duracao_min' || fieldId == 'custrecord_bit_check_duracao_min') {
            //     var name = 'DURAÇÃO MINUTOS';
            //     var field = 'custrecord_bit_duracao_min_linha';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_duracao_min' });
            //     id = fieldId == 'custrecord_bit_check_duracao_min' ? '' : id;

            //     if (fieldId == 'custrecord_bit_check_duracao_min' && currentRecord.getValue({ fieldId: 'custrecord_bit_check_duracao_min' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_duracao_min' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_duracao_min' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_duracao_min' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_check_duracao_min' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_check_duracao_min' && !currentRecord.getValue({ fieldId: 'custrecord_bit_duracao_min' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_pagaougratuita' || fieldId == 'custrecord_bit_check_pag_grat') {
            //     var name = 'PAGA OU GRATUITA';
            //     var field = 'custrecord_bit_paga_gratuita_linha';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_pagaougratuita' });
            //     id = fieldId == 'custrecord_bit_check_pag_grat' ? '' : id;

            //     if (fieldId == 'custrecord_bit_check_pag_grat' && currentRecord.getValue({ fieldId: 'custrecord_bit_check_pag_grat' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_pagaougratuita' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_pagaougratuita' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_pagaougratuita' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_check_pag_grat' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_check_pag_grat' && !currentRecord.getValue({ fieldId: 'custrecord_bit_pagaougratuita' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_tipo_publico' || fieldId == 'custrecord_bit_check_tipo_public') {
            //     var name = 'TIPO PÚBLICO';
            //     var field = 'custrecord_bit_tipo_publico_linha';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_tipo_publico' });
            //     id = fieldId == 'custrecord_bit_check_tipo_public' ? '' : id;

            //     if (fieldId == 'custrecord_bit_check_tipo_public' && currentRecord.getValue({ fieldId: 'custrecord_bit_check_tipo_public' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_tipo_publico' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_tipo_publico' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_tipo_publico' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_check_tipo_public' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_check_tipo_public' && !currentRecord.getValue({ fieldId: 'custrecord_bit_tipo_publico' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_checkbox_acesscomu' || fieldId == 'custrecord_bit_ac_com_varia') {
            //     var name = 'ACESS COMUNICACIONAL';
            //     var field = 'custrecordbit_linha_acess_com';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_checkbox_acesscomu' });
            //     id = fieldId == 'custrecord_bit_ac_com_varia' ? false : id;

            //     if (fieldId == 'custrecord_bit_ac_com_varia' && currentRecord.getValue({ fieldId: 'custrecord_bit_ac_com_varia' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_checkbox_acesscomu' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_checkbox_acesscomu' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_checkbox_acesscomu' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_ac_com_varia' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_ac_com_varia' && !currentRecord.getValue({ fieldId: 'custrecord_bit_checkbox_acesscomu' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_parceria_checkbox' || fieldId == 'custrecord_bit_parceria_varia') {
            //     var name = 'PARCERIA';
            //     var field = 'custrecord_bit_linha_parceria';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_parceria_checkbox' });
            //     id = fieldId == 'custrecord_bit_parceria_varia' ? false : id;

            //     if (fieldId == 'custrecord_bit_parceria_varia' && currentRecord.getValue({ fieldId: 'custrecord_bit_parceria_varia' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_parceria_checkbox' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_parceria_checkbox' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_parceria_checkbox' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_parceria_varia' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_parceria_varia' && !currentRecord.getValue({ fieldId: 'custrecord_bit_parceria_checkbox' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_pactua' || fieldId == 'custrecord_bit_pactua_varia') {
            //     var name = 'PACTUA';
            //     var field = 'custrecord_bit_linha_pactua';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_pactua' });
            //     id = fieldId == 'custrecord_bit_pactua_varia' ? false : id;

            //     if (fieldId == 'custrecord_bit_pactua_varia' && currentRecord.getValue({ fieldId: 'custrecord_bit_pactua_varia' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_pactua' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_pactua' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_pactua' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_pactua_varia' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_pactua_varia' && !currentRecord.getValue({ fieldId: 'custrecord_bit_pactua' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_acess_comu' || fieldId == 'custrecord_bit_acesseso_com_varia') {
            //     var name = 'ACESSORIA COMUNICAÇÃO';
            //     var field = 'custrecord_bit_linha_acessoriacom';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_acess_comu' });
            //     id = fieldId == 'custrecord_bit_acesseso_com_varia' ? '' : id;

            //     if (fieldId == 'custrecord_bit_acesseso_com_varia' && currentRecord.getValue({ fieldId: 'custrecord_bit_acesseso_com_varia' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_acess_comu' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_acess_comu' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_acess_comu' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_acesseso_com_varia' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_acesseso_com_varia' && !currentRecord.getValue({ fieldId: 'custrecord_bit_acess_comu' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            // if (fieldId == 'custrecord_bit_release_acao' || fieldId == 'custrecord_bit_acao_release_varia') {
            //     var name = 'RELEASE';
            //     var field = 'custrecord_bit_linha_release';
            //     var id = currentRecord.getValue({ fieldId: 'custrecord_bit_release_acao' });
            //     id = fieldId == 'custrecord_bit_acao_release_varia' ? '' : id;

            //     if (fieldId == 'custrecord_bit_acao_release_varia' && currentRecord.getValue({ fieldId: 'custrecord_bit_acao_release_varia' }) == false) {
            //         id = currentRecord.getValue({ fieldId: 'custrecord_bit_release_acao' });
            //     }

            //     var indexLine = _getIndexLine(currentRecord, name);
            //     if (indexLine == -1) {
            //         _createLine(currentRecord, name, id, field);
            //     } else {
            //         if (
            //             fieldId == 'custrecord_bit_release_acao' &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_release_acao' }) &&
            //             !currentRecord.getValue({ fieldId: 'custrecord_bit_acao_release_varia' })) {
            //             //Zera se removeu o campo e não contém Variável.
            //             _removeLine(currentRecord, indexLine);
            //         } else if (fieldId == 'custrecord_bit_acao_release_varia' && !currentRecord.getValue({ fieldId: 'custrecord_bit_release_acao' })) {
            //             //Zera se removeu a Variável e não contém o campo.
            //             _removeLine(currentRecord, indexLine);
            //         } else {
            //             //Edição dos campos
            //             _editLine(currentRecord, id, indexLine, field);
            //         }
            //     }
            // };

            if (fieldId == 'custrecord_bit_linha_realizado_estatico') {
                const currentScript = runtime.getCurrentScript();
                const parameterStatus = currentScript.getParameter({ name: 'custscript_bit_id_indicador_meta' });
                const parameterAtributo = currentScript.getParameter({ name: 'custscript_bit_id_atributo' });

                var fieldAcao = currentRecord.getValue({ fieldId: 'custrecord_bit_checkbox_totaliza' });

                currentRecord.selectLine({ sublistId: 'recmachcustrecord_bit_link_acao', line: lineNum });
                var valueField = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_linha_realizado_estatico' });
                var indicador = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_tipoindicador' });
                var atributo = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_at_indic' });

                if (!fieldAcao && valueField || indicador != parameterStatus || atributo != parameterAtributo) {
                    dialog.alert({
                        title: 'Alerta!',
                        message: 'Não é possível preencher, pois a ação não é totalizadora <b>ou</b> o atributo não é meta-produto.'
                    });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_linha_realizado_estatico', value: '', ignoreFieldChange: true });
                }

                if (fieldAcao && valueField != 1 && atributo == parameterAtributo && indicador == parameterStatus) {
                    dialog.alert({
                        title: 'Alerta!',
                        message: 'Não é possível preencher com um valor diferente de 1.'
                    });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_linha_realizado_estatico', value: '', ignoreFieldChange: true });
                }
                // currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_link_acao' });
            }
        }

        /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(context) {
        const currentRecord = context.currentRecord;
        const sublistId = context.sublistId;
        log.debug('sublistId', sublistId)
        
        if (sublistId == 'recmachcustrecord_bit_link_acao') {
            // const lineNum = currentRecord.getCurrentSublistValue({
            //     sublistId: sublistId,
            //     filedId: 'line'
            // });
            const currentScript = runtime.getCurrentScript();
            const parameterStatus = currentScript.getParameter({ name: 'custscript_bit_id_indicador_meta' });
            const parameterAtributo = currentScript.getParameter({ name: 'custscript_bit_id_atributo' });

            var fieldAcao = currentRecord.getValue({ fieldId: 'custrecord_bit_checkbox_totaliza' });

            // currentRecord.selectLine({ sublistId: 'recmachcustrecord_bit_link_acao', line: lineNum });
            var valueField = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_linha_realizado_estatico' });
            var indicador = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_tipoindicador' });
            var atributo = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_at_indic' });

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
    }

        function _createLine(currentRecord, name, id, field) {
            const currentScript = runtime.getCurrentScript();
            const parameterStatus = currentScript.getParameter({ name: 'custscript_bit_id_indicador' });

            currentRecord.selectNewLine({ sublistId: 'recmachcustrecord_bit_link_acao', });
            currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'name', value: name });
            currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: 'custrecord_bit_tipoindicador', value: parameterStatus });
            currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: field, value: id });
            currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_link_acao' });
        }

        function _editLine(currentRecord, id, indexLine, field) {
            currentRecord.selectLine({ sublistId: 'recmachcustrecord_bit_link_acao', line: indexLine });
            currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_link_acao', fieldId: field, value: id });
            currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_link_acao' });
        }

        function _removeLine(currentRecord, indexLine) {
            currentRecord.removeLine({ sublistId: 'recmachcustrecord_bit_link_acao', line: indexLine });
        }

        function _getIndexLine(currentRecord, name) {
            return currentRecord.findSublistLineWithValue({
                sublistId: 'recmachcustrecord_bit_link_acao',
                fieldId: 'name',
                value: name
            });
        }

        return {
            // fieldChanged: fieldChanged,
            validateLine: validateLine
        };
    });