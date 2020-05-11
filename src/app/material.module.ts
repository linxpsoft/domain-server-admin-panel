import {
	MdcButtonModule,
	MdcCardModule,
	MdcCheckboxModule,
	MdcChipsModule,
	MDCDataTableModule,
	MdcDrawerModule,
	MdcFormFieldModule,
	MdcIconButtonModule,
	MdcIconModule,
	MdcLinearProgressModule,
	MdcListModule,
	MdcMenuModule,
	MdcMenuSurfaceModule,
	MdcSelectModule,
	MdcSnackbarModule,
	MdcSwitchModule,
	MdcTabBarModule,
	MdcTextFieldModule,
} from "@angular-mdc/web";
import { NgModule } from "@angular/core";

const modules = [
	MdcButtonModule,
	MdcCardModule,
	MdcCheckboxModule,
	MdcChipsModule,
	MDCDataTableModule,
	MdcDrawerModule,
	MdcFormFieldModule,
	MdcIconButtonModule,
	MdcIconModule,
	MdcLinearProgressModule,
	MdcListModule,
	MdcMenuModule,
	MdcMenuSurfaceModule,
	MdcSelectModule,
	MdcSnackbarModule,
	MdcSwitchModule,
	MdcTabBarModule,
	MdcTextFieldModule,
];

@NgModule({ exports: modules })
export class MaterialModule {}
