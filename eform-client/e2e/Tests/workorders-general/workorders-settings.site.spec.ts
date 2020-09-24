import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';
import deviceUsersPage, {DeviceUsersRowObject} from '../../Page objects/DeviceUsers.page';
import workOrdersPage from '../../Page objects/WorkOrders/WorkOrders.page';

const expect = require('chai').expect;

const name = Guid.create().toString();
const surname = Guid.create().toString();

describe('Work Order Settings Site', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});

    deviceUsersPage.createNewDeviceUser(name, surname);
  });
  it('Assign Site', function() {
    workOrdersPage.goToWorkOrdersSettingsPage();
    $('#addNewSiteBtn').waitForDisplayed({timeout: 20000});
    const rowCountBeforeCreation = workOrdersPage.rowNum;
    $('#addNewSiteBtn').click();
    browser.pause(5000);
    $('#selectDeviceUser').waitForDisplayed({timeout: 20000});
    $('#selectDeviceUser').click();
    browser.pause(1000);
    $('#selectDeviceUser input').setValue(name);
    browser.pause(5000);
    $$('#selectDeviceUser .ng-option')[0].click();
    $('#siteAssignBtnSave').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const rowCountAfterCreation = workOrdersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after adding site').equal(rowCountBeforeCreation + 1);
  });
  it('Cancel Removing Site', function () {
    $('#addNewSiteBtn').waitForDisplayed({timeout: 20000});
    const rowCountBefore = workOrdersPage.rowNum;
    $$('#removeSiteBtn')[$$('#removeSiteBtn').length - 1].click();
    $('#removeSiteSaveCancelBtn').waitForDisplayed({timeout: 20000});
    $('#removeSiteSaveCancelBtn').click();
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore);
  });
  it('Remove Site', function () {
    $('#addNewSiteBtn').waitForDisplayed({timeout: 20000});
    const rowCountBefore = workOrdersPage.rowNum;
    $$('#removeSiteBtn')[$$('#removeSiteBtn').length - 1].click();
    $('#removeSiteSaveBtn').waitForDisplayed({timeout: 20000});
    $('#removeSiteSaveBtn').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore - 1);
  });
  it('Cancel Adding Site', function() {
    $('#addNewSiteBtn').waitForDisplayed({timeout: 20000});
    const rowCountBefore = workOrdersPage.rowNum;
    $('#addNewSiteBtn').click();
    $('#selectDeviceUser').waitForDisplayed({timeout: 20000});
    $('#selectDeviceUser').click();
    $$('#selectDeviceUser .ng-option')[0].click();
    $('#siteAssignBtnSaveCancel').click();
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore);
  });
});
