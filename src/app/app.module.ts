import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./material.module";
import { OverviewComponent } from "./overview/overview.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { WizardComponent } from "./wizard/wizard.component";
import { NodesComponent } from "./nodes/nodes.component";
import { KeyValueStartsWithPipe } from "./pipes/key-value-starts-with.pipe";
import { NetworkingComponent } from "./networking/networking.component";
import { PermissionsComponent } from "./permissions/permissions.component";
import { PrettifyCamelCasePipe } from "./pipes/prettify-camel-case.pipe";

@NgModule({
	declarations: [
		AppComponent,
		OverviewComponent,
		SidebarComponent,
		WizardComponent,
		NodesComponent,
		KeyValueStartsWithPipe,
		NetworkingComponent,
		PermissionsComponent,
		PrettifyCamelCasePipe,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MaterialModule,
		HttpClientModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
