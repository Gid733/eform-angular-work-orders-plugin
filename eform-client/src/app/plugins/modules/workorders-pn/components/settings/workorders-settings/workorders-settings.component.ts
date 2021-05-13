import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WorkOrdersSettingsModel } from '../../../models';
import { WorkOrdersSettingsService } from '../../../services';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SitesService, FoldersService } from 'src/app/common/services';
import { FolderDto, SiteNameDto } from 'src/app/common/models';
import {
  WorkOrdersFoldersModalComponent,
  SettingsAddSiteModalComponent,
  SettingsRemoveSiteModalComponent,
} from '../../';
import { composeFolderName } from 'src/app/common/helpers';

@AutoUnsubscribe()
@Component({
  selector: 'app-workorders-settings',
  templateUrl: './workorders-settings.component.html',
  styleUrls: ['./workorders-settings.component.scss'],
})
export class WorkOrdersSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('removeSiteModal')
  removeSiteModal: SettingsRemoveSiteModalComponent;
  @ViewChild('addSiteModal') addSiteModal: SettingsAddSiteModalComponent;
  @ViewChild('foldersModal', { static: false })
  foldersModal: WorkOrdersFoldersModalComponent;
  workOrdersSettingsModel: WorkOrdersSettingsModel = new WorkOrdersSettingsModel();
  sites: SiteNameDto[] = [];
  foldersTreeDto: FolderDto[] = [];
  foldersDto: FolderDto[] = [];
  settingsSub$: Subscription;
  sitesSub$: Subscription;
  foldersSubTree$: Subscription;
  foldersSub$: Subscription;
  folderUpdateSub$: Subscription;
  tasksFolder: boolean;

  constructor(
    private settingsService: WorkOrdersSettingsService,
    private sitesService: SitesService,
    private foldersService: FoldersService
  ) {}

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {
    this.settingsSub$ = this.settingsService
      .getAllSettings()
      .subscribe((data) => {
        if (data && data.success) {
          this.workOrdersSettingsModel = data.model;
          this.loadAllFoldersTree();
        }
      });
  }

  getSites() {
    this.sitesSub$ = this.sitesService.getAllSites().subscribe((data) => {
      if (data && data.success) {
        this.sites = data.model;
        this.loadFlatFolders();
      }
    });
  }

  loadAllFoldersTree() {
    this.foldersSubTree$ = this.foldersService
      .getAllFolders()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.foldersTreeDto = operation.model;
          this.getSites();
        }
      });
  }

  loadFlatFolders() {
    this.foldersSub$ = this.foldersService
      .getAllFoldersList()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.foldersDto = operation.model;
          this.setFolderName();
          this.setFolderTaskName();
        }
      });
  }

  showAddNewSiteModal() {
    this.addSiteModal.show(
      this.sites,
      this.workOrdersSettingsModel.assignedSites
    );
  }

  showRemoveSiteModal(selectedSite: SiteNameDto) {
    this.removeSiteModal.show(selectedSite);
  }

  openFoldersModal() {
    this.tasksFolder = false;
    this.foldersModal.show(this.workOrdersSettingsModel.folderId);
  }

  openTasksFoldersModal() {
    this.tasksFolder = true;
    this.foldersModal.show(this.workOrdersSettingsModel.folderTasksId);
  }

  onFolderSelected(folderDto: FolderDto) {
    if (this.tasksFolder) {
      this.updateFolderTask(folderDto.id);
    } else {
      this.updateFolder(folderDto.id);
    }
  }

  setFolderTaskName() {
    this.workOrdersSettingsModel.folderTasksId === null
      ? (this.workOrdersSettingsModel.folderTasksName = null)
      : (this.workOrdersSettingsModel.folderTasksName = composeFolderName(
          this.workOrdersSettingsModel.folderTasksId,
          this.foldersDto
        ));
  }

  setFolderName() {
    this.workOrdersSettingsModel.folderId === null
      ? (this.workOrdersSettingsModel.folderName = null)
      : (this.workOrdersSettingsModel.folderName = composeFolderName(
          this.workOrdersSettingsModel.folderId,
          this.foldersDto
        ));
  }

  updateFolder(folderDtoId: number) {
    this.folderUpdateSub$ = this.settingsService
      .updateSettingsFolder(folderDtoId)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.getSettings();
        }
      });
  }

  updateFolderTask(folderDtoId: number) {
    this.folderUpdateSub$ = this.settingsService
      .updateSettingsTasksFolder(folderDtoId)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.getSettings();
        }
      });
  }

  ngOnDestroy(): void {}
}
