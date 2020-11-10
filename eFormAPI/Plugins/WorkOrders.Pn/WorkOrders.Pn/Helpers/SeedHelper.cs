﻿using eFormCore;
using Microting.eForm.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microting.eForm.Infrastructure.Constants;

// ReSharper disable StringLiteralTypo

namespace WorkOrders.Pn.Helpers
{
    using Infrastructure.Consts;
    using Microting.eForm.Dto;

    public class SeedHelper
    {
        private static async Task<int> CreateTaskAreaList(Core core)
        {
            EntityGroupList model = await core.Advanced_EntityGroupAll(
                "id",
                "eform-angular-work-orders-plugin-editable-TaskArea",
                0, 1, Constants.FieldTypes.EntitySelect,
                false,
                Constants.WorkflowStates.NotRemoved);

            EntityGroup group;

            if (!model.EntityGroups.Any())
            {
                group = await core.EntityGroupCreate(Constants.FieldTypes.EntitySelect,
                    "eform-angular-work-orders-plugin-editable-TaskArea");
            }
            else
            {
                group = model.EntityGroups.First();
            }

            return int.Parse(group.MicrotingUUID);
        }

        private static async Task<int> CreateWorkerList(Core core)
        {
            EntityGroupList model = await core.Advanced_EntityGroupAll(
                "id",
                "eform-angular-work-orders-plugin-editable-Worker",
                0, 1, Constants.FieldTypes.EntitySelect,
                false,
                Constants.WorkflowStates.NotRemoved);

            EntityGroup group;

            if (!model.EntityGroups.Any())
            {
                group = await core.EntityGroupCreate(Constants.FieldTypes.EntitySelect,
                    "eform-angular-work-orders-plugin-editable-Worker");
            }
            else
            {
                group = model.EntityGroups.First();
            }
            return int.Parse(group.MicrotingUUID);
        }

        public static async Task<int> CreateNewTaskEform(Core core)
        {

            const string timeZone = "Europe/Copenhagen";
            TimeZoneInfo timeZoneInfo;

            try
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
            }
            catch
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
            }
            int taskAreaListId = await CreateTaskAreaList(core);
            int workerListId = await CreateWorkerList(core);

            List<Template_Dto> templatesDto = await core.TemplateItemReadAll(false,
                "",
                "eform-angular-work-orders-plugin-newtask",
                false,
                "",
                new List<int>(),
                timeZoneInfo
                );

            if (templatesDto.Count > 0)
            {
                return templatesDto.First().Id;
            }
            else
            {
                MainElement newTaskForm = new MainElement
                {
                    Id = WorkOrderEformConsts.NewTaskId,
                    Repeated = 0,
                    Label = "eform-angular-work-orders-plugin-newtask",
                    StartDate = new DateTime(2020, 09, 14),
                    EndDate = new DateTime(2030, 09, 14),
                    Language = "da",
                    MultiApproval = false,
                    FastNavigation = false,
                    DisplayOrder = 0,
                    EnableQuickSync = true
                };

                List<DataItem> dataItems = new List<DataItem>
                {
                    new EntitySelect(
                        371261, 
                        false, 
                        false, 
                        "Opgave område",
                        "", 
                        Constants.FieldColors.Default, 
                        0, 
                        false,
                        0, 
                        taskAreaListId),
                    new EntitySelect(
                        371262, 
                        false, 
                        false, 
                        "Opgave tildelt til",
                        "", 
                        Constants.FieldColors.Default, 
                        0, 
                        false,
                        0, 
                        workerListId),
                    new Picture(
                        371263,
                        false,
                        false,
                        "Opgave billede",
                        "<br>",
                        Constants.FieldColors.Default,
                        0,
                        false,
                        0,
                        false
                    ),
                    new Text(
                        371264,
                        true,
                        false,
                        "Opgave beskrivelse",
                        "",
                        Constants.FieldColors.Default,
                        1,
                        false,
                        "",
                        0,
                        false,
                        false,
                        false,
                        false,
                        ""
                    ),
                    new Date(
                        371265,
                        true,
                        false,
                        "Opgave udføres senest",
                        "",
                        Constants.FieldColors.Default,
                        2,
                        false,
                        new DateTime(),
                        new DateTime(),
                        ""
                    ),
                    new SaveButton(
                        371266,
                        false,
                        false,
                        "Tryk for at oprette opgave",
                        "",
                        Constants.FieldColors.Green,
                        2,
                        false,
                        "Opret opgave"
                    )
                };


                DataElement dataElement = new DataElement(
                    142108,
                    "Ny opgave",
                    0,
                    "", // ?
                    false,
                    false,
                    false,
                    false,
                    "",
                    false,
                    new List<DataItemGroup>(),
                    dataItems);

                newTaskForm.ElementList.Add(dataElement);

                newTaskForm = await core.TemplateUploadData(newTaskForm);
                return await core.TemplateCreate(newTaskForm);
            }
        }

        public static async Task<int> CreateTaskListEform(Core core)
        {
            string timeZone = "Europe/Copenhagen";
            TimeZoneInfo timeZoneInfo;

            try
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
            }
            catch
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
            }

            List<Template_Dto> templatesDto = await core.TemplateItemReadAll(false,
                    "",
                    "eform-angular-work-orders-plugin-tasklist",
                    false,
                    "",
                    new List<int>(),
                    timeZoneInfo
                    );

            if (templatesDto.Count > 0)
            {
                return templatesDto.First().Id;
            }
            else
            {
                MainElement taskListForm = new MainElement
                {
                    Id = WorkOrderEformConsts.TaskListId,
                    Repeated = 0,
                    Label = "eform-angular-work-orders-plugin-tasklist",
                    StartDate = new DateTime(2020, 09, 14),
                    EndDate = new DateTime(2030, 09, 14),
                    Language = "da",
                    MultiApproval = false,
                    FastNavigation = false,
                    DisplayOrder = 0,
                    EnableQuickSync = true
                };

                List<DataItem> dataItems = new List<DataItem>
                {
                    new None(
                        371267,
                        false,
                        false,
                        "Beskrivelse af opgaven",
                        "",
                        Constants.FieldColors.Yellow,
                        0,
                        false
                    ),
                    new ShowPdf(
                        371268,
                        false,
                        false,
                        "Tryk på PDF for at se billeder af opgaven",
                        "",
                        Constants.FieldColors.Default,
                        1,
                        false,
                        "https://eform.microting.com/app_files/uploads/20200914114927_14937_9fae9a0b11bda418201523437984027c.pdf"
                    ),
                    new CheckBox(
                        371269,
                        true,
                        false,
                        "Sæt flueben når opgaven er udført",
                        "",
                        Constants.FieldColors.Default,
                        2,
                        false,
                        false,
                        false
                    ),
                    new Picture(
                        371270,
                        false,
                        false,
                        "Billede af udført opgave",
                        "<br>",
                        Constants.FieldColors.Default,
                        3,
                        false,
                        0,
                        false
                    ),
                    new Text(
                        371271,
                        false,
                        false,
                        "Beskrivelse af udført opgave",
                        "",
                        Constants.FieldColors.Default,
                        4,
                        false,
                        "",
                        0,
                        false,
                        false,
                        false,
                        false,
                        ""
                    ),
                    new SaveButton(
                        371272,
                        false,
                        false,
                        "Tryk for at sende udført opgave",
                        "",
                        Constants.FieldColors.Green,
                        5,
                        false,
                        "Opgave udført"
                    )
                };


                DataElement dataElement = new DataElement(
                    142109,
                    "Opgave registreret",
                    0,
                    "", 
                    false,
                    false,
                    false,
                    false,
                    "",
                    false,
                    new List<DataItemGroup>(),
                    dataItems);

                taskListForm.ElementList.Add(dataElement);

                taskListForm = await core.TemplateUploadData(taskListForm);
                return await core.TemplateCreate(taskListForm);
            }
        }
    }
}
