#!/bin/bash
perl -pi -e '$_.="  },\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="      .then(m => m.WorkOrdersPnModule)\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="    loadChildren: () => import('\''./modules/workorders-pn/work-orders-pn.module'\'')\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="    path: '\''work-orders-pn'\'',\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  {\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
