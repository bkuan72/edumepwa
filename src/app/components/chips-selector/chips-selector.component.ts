import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonFn } from 'app/shared/common-fn';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
    selector: 'app-chips-selector',
    templateUrl: './chips-selector.component.html',
    styleUrls: ['./chips-selector.component.scss'],
})
export class ChipsSelectorComponent implements OnInit {
    @Input() allData: string[];
    @Input() placeholder: string;
    @Input() chipCsvList: string;
    @Input() chipName: string;
    @Input() canRemove: boolean;
    @Input() displayOnly: boolean;
    @Input() required: string;
    @Input() controlName: string;
    @Input() control: FormControl;
    @Output() onChange: EventEmitter<string> = new EventEmitter();

    @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    newChipList: string;
    selectable = true;
    chipCtrl = new FormControl();
    keywords: string[];
    chips: {name: string}[];
    tags: string[];
    filteredList: Observable<string[]>;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    constructor(private _fn: CommonFn) {
        this.chips = [];
    }

    ngOnInit(): void {
        if (this._fn.emptyStr(this.chipCsvList)) {
            this.keywords = [];
        } else {
            this.keywords = this.chipCsvList.split(',');
            this.keywords.forEach((word: string) => {
                if (!this._fn.emptyStr(word)) {
                    this.chips.push({
                        name: word.trim()
                    });
                }
            });
        }
        this.filteredList = this.chipCtrl.valueChanges.pipe(
            startWith(null),
            map((word: string | null) => word ? this._filter(word) : this.allData.slice()));
    }

    removeChip(remChip: any): void {
        if (!this.canRemove) {
            return;
        }
        function checkName(chip: { name: string }): boolean  {
            return chip.name === remChip.name;
        }
        const idx = this.chips.findIndex(checkName);
        if (idx >= 0) {
            this.chips.splice(idx);
            this.formatNewCsvList();
        }

    }
    addUniqueValue(value: string): void {
        function checkName(chip: { name: string }): boolean  {
            return chip.name === value;
        }
        const idx = this.chips.indexOf(checkName);
        if (idx < 0) {
            this.chips.push({ name: value });
            this.formatNewCsvList();
        }
    }

    addChip($event: any): void {
        const input = $event.input;
        const value = $event.value;
        if (this._fn.emptyStr($event.value)) {
            return;
        }
        this.addUniqueValue(value);
        input.value = '';
    }

    private formatNewCsvList(): void {
        let csv: string;
        this.chips.map((val) => {
            if (csv) {
                csv += ',' + val.name;
            } else {
                csv = val.name;
            }
            return csv;
        });
        if (csv) {
            this.newChipList = csv;
        } else {
            this.newChipList = '';
        }
        if (!this._fn.emptyStr(this.controlName) &&
            this.control) {
                this.control[this.controlName].patchValue(this.newChipList);
            }
        this.onChange.emit(this.newChipList);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.addUniqueValue(event.option.viewValue);
        this.chipInput.nativeElement.value = '';
      }


    _filter(word: string): string[] {
        const filterValue = word.toLowerCase();

        return this.allData.filter(value => value.toLowerCase().indexOf(filterValue) === 0);
    }
}
