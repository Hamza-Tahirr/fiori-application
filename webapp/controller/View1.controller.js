sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("testing.test.controller.View1", {
        onInit: function () {
            var oHitModel = new JSONModel({
                items: []
            });
            this.getView().setModel(oHitModel, "HitModel");
        },
        
        btnApprove: function (e) {
            var oView = this.getView();
            var fname = oView.byId("nameID").getValue();
            var lname = oView.byId("lastnameID").getValue();
            var trno = oView.byId("TRNumberID").getValue();

            var oNewEntry = {
                "FIRST_NAME": fname,
                "LAST_NAME": lname,
                "TRNO": trno
            };

            var oHitModel = oView.getModel("HitModel");
            var aItems = oHitModel.getProperty("/items");
            aItems.push(oNewEntry);
            oHitModel.setProperty("/items", aItems);

            var oPayload = {
                IvCall: 'S',
                IvJson: JSON.stringify(oNewEntry)
            };

            var sUrl4 = "/sap/opu/odata/sap/ZTEST_HAMZA_SRV/";
            var oModel = new sap.ui.model.odata.ODataModel(sUrl4, true);
            var sPathInquire = "/savedataSet";

            oModel.create(sPathInquire, oPayload, {
                headers: { "Content-Type": "application/json" },
                success: function (success) {
                    MessageToast.show("Data saved successfully.");
                },
                error: function (error) {
                    MessageToast.show("Error saving data.");
                }
            });
        },
        
        onDeleteTable: function (oEvent) {
            var oItem = oEvent.getParameter("listItem") || oEvent.getSource().getParent();
            var oTable = this.byId("tableID");
            var oModel = oTable.getModel("HitModel");
            var aItems = oModel.getProperty("/items");
            var iIndex = oTable.indexOfItem(oItem);
            
            var oDeletedItem = aItems[iIndex];
            aItems.splice(iIndex, 1);
            oModel.setProperty("/items", aItems);

            var sUrl4 = "/sap/opu/odata/sap/ZTEST_HAMZA_SRV/";
            var oODataModel = new sap.ui.model.odata.ODataModel(sUrl4, true);
            var sPathInquire = "/savedataSet(IvCall='S',IvJson='" + encodeURIComponent(JSON.stringify(oDeletedItem)) + "')";

            oODataModel.remove(sPathInquire, {
                headers: { "Content-Type": "application/json" },
                success: function () {
                    MessageToast.show("Data deleted successfully.");
                },
                error: function (oError) {
                    var sMessage = JSON.parse(oError.responseText).error.message.value;
                    MessageToast.show("Error deleting data: " + sMessage);
                }
            });
        }
    });
});
