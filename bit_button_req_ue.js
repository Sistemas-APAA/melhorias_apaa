/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

define([
    'N/runtime',
    'N/ui/serverWidget',
    'N/search'
],
    function (
        runtime,
        serverWidget,
        search
    ) {

        function beforeLoad(context) {
            if (
                context.type == context.UserEventType.VIEW
            ) {
                const newRecord = context.newRecord;
                const form = context.form;
                const idRequisition = newRecord.id;

                form.removeButton('createpo'); //REMOVE BOTÃO NATIVO DE GERAR PEDIDO DE COMPRAS

                const searchItensCot = search.create({
                    type: "customrecord_bit_sublist_itens_cot",
                    filters:
                        [
                            ["custrecord_bit_rt_itens_premio", "is", "T"],
                            "AND",
                            ["custrecord_bit_rt_itens_transaction", "anyof", idRequisition],
                            "AND",
                            ["custrecord_bit_rt_itens_fat", "is", "F"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid" })
                        ]
                });

                const lengthSearch = searchItensCot.run().getRange({ start: 0, end: 1000 }).length;
                if (lengthSearch <= 0) return;

                var loadScreenField = form.addField({
                    type: 'inlinehtml',
                    id: 'custpage_bit_load_scn',
                    label: 'Load Screen'
                });
                loadScreenField.defaultValue = '<div id="loadscreen" style="display:flex; justify-content: center; align-items: center; flex-direction: row; flex-wrap: wrap; position: fixed; height: 100%; width: 100%; z-index: 1000; background: rgba(175, 175, 175, 0.8); top: 0; left: 0; visibility: hidden; font-size: 30px; text-transform: uppercase; font-weight: 700;"><p style="margin-bottom: 150px;">Aguarde um momento enquanto os pedidos são gerados</p><br><div style="margin-top: 100px; position: fixed; border: 16px solid #f3f3f3; border-radius: 50%;border-top: 16px solid #3498db;width: 100px;height: 100px; -webkit-animation: spin 1s linear infinite;animation: spin 1s linear infinite;"></div></div>';
                loadScreenField.updateLayoutType({ layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE });

                form.addButton({
                    id: 'custpage_bit_gerate_po',
                    label: 'Gerar pedidos de compra',
                    functionName: 'gerate(' + idRequisition + ')'
                });

                form.clientScriptModulePath = 'SuiteScripts/bit_actions_buttons_req_cs.js';
                return;
            };
        };

        return {
            beforeLoad: beforeLoad
        };
    })