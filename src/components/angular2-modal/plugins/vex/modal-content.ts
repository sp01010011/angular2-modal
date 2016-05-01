import {
    Component,
    DynamicComponentLoader,
    ViewContainerRef,
    ViewChild,
    ViewEncapsulation,
    AfterViewInit
} from 'angular2/core';

import {Modal} from '../../providers/modal';
import {ModalCompileConfig} from '../../models/tokens';
import {DialogRef} from '../../models/dialog-ref';
import {VEXModalContext} from './modal-context';

/**
 * A component that acts as a top level container for an open modal window.
 */
@Component({
    selector: 'modal-content',
    template:
`<div [class]="context.contentClassName" (clickOutside)="onClickOutside()">
    <div style="display: none" #modalDialog></div>    
    <div *ngIf="context.showCloseButton" 
         [class]="context.closeClassName" 
         (click)="dialog.dismiss()"></div>
</div>`,
    encapsulation: ViewEncapsulation.None,
})
export class VexModalContent implements AfterViewInit {
    private context: VEXModalContext;
    @ViewChild('modalDialog', {read: ViewContainerRef}) private _viewContainer: ViewContainerRef;

    constructor(public dialog: DialogRef<VEXModalContext>,
                private _modal: Modal,
                private _compileConfig: ModalCompileConfig,
                private _dlc: DynamicComponentLoader) {
        this.context = dialog.context;
    }

    ngAfterViewInit() {
        this._dlc
            .loadNextToLocation(this._compileConfig.component,
                this._viewContainer,
                this._compileConfig.bindings)
            .then(contentRef => this.dialog.contentRef = contentRef);
    }

    onClickOutside() {
        // check that this modal is the last in the stack.
        return this._modal.isTopMost(this.dialog) &&
            !this.dialog.context.isBlocking &&
            this.dialog.dismiss();
    }
}
