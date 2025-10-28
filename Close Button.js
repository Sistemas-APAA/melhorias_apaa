define([], function() {

    function closeWindow() {
        if (window.opener) {
            window.close();
        } else {
            window.location.href = '/app/accounting/transactions/vendbill.nl';
        }
    }

    function pageInit(context) {
        closeWindow();
    }

    return {
        pageInit: pageInit
    };
});
