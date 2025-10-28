define(['N/record', 'N/search'], function(record, search) {
    function getRelatedRecords(transactionId) {
        // Carrega a transação principal
        var transactionRecord = record.load({
            type: record.Type.SALES_ORDER,
            id: transactionId
        });

        // Exemplo de busca por registros relacionados
        var relatedSearch = search.create({
            type: 'transaction',
            filters: [
                ['internalid', 'anyof', transactionId]
            ],
            columns: [
                'internalid', 
                'trandate', 
                'amount', 
                'entity'
            ]
        });

        var resultSet = relatedSearch.run();
        resultSet.each(function(result) {
            // Processa cada resultado conforme necessário
            log.debug({
                title: 'Transaction Result',
                details: result
            });
            return true; // Continua a iteração
        });
    }

    return {
        getRelatedRecords: getRelatedRecords
    };
});
