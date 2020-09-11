﻿using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkOrders.Pn.Infrastructure.Models.Settings;

namespace WorkOrders.Pn.Abstractions
{
    public interface IWorkOrdersSettingsService
    {
        Task<OperationDataResult<WorkOrdersSettingsModel>> GetAllSettingsAsync();
        Task<OperationResult> AddSiteToSettingsAsync(int siteId);
        Task<OperationResult> RemoveSiteFromSettingsAsync(int siteId);
    }
}
