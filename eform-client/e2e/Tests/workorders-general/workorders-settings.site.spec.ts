import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';
import deviceUsersPage, {DeviceUsersRowObject} from '../../Page objects/DeviceUsers.page';
import workOrdersPage from '../../Page objects/WorkOrders/WorkOrders.page';

const expect = require('chai').expect;

const name = Guid.create().toString();
const surname = Guid.create().toString();

describe('Work Order Settings', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();

    myEformsPage.Navbar.goToDeviceUsersPage();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
    deviceUsersPage.createNewDeviceUser(name, surname);
  });
  it('Assign Site', function() {
    workOrdersPage.goToWorkOrdersSettingsPage();
    const rowCountBeforeCreation = workOrdersPage.rowNum;
    workOrdersPage.assignDeviceUser(name);
    const rowCountAfterCreation = workOrdersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after adding site').equal(rowCountBeforeCreation + 1);
  });
  it('Cancel Removing Site', function () {
    const rowCountBefore = workOrdersPage.rowNum;
    workOrdersPage.cancelRemovingDeviceUser();
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore);
  });
  it('Remove Site', function () {
    const rowCountBefore = workOrdersPage.rowNum;
    workOrdersPage.removeAssignedDeviceUser();
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore - 1);
  });
  it('Cancel Adding Site', function() {
    const rowCountBefore = workOrdersPage.rowNum;
    workOrdersPage.cancelAddingDeviceUser();
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore);
  });
});
