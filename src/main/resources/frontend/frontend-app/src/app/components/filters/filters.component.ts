import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {HttpClientService} from "../../service/http-client.service";
import {HotelService} from "../../service/hotel.service";
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../category-list/category.model';
import { OtherFilters } from './other-filter.model';
import { FiltersModel } from './filters.model';

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  providers: [NgbRatingConfig]
})

export class FiltersComponent {
  @Output()
  filteredCategories: EventEmitter<Category[]> = new EventEmitter();

  private selectedItems: Map<string, Array<any>>;
  private _dropdownSettings: IDropdownSettings;
  public activities: any;
  public locations: any;
  public selectedActivities: any[] = [];
  
  public minPrice: number;
  public maxPrice: number;
  public minRating: number;
  public maxRating: number;
  public starsFilter: number = 0;
  public currentlySelectedActivities: any;  
  public currentlySelectedLocations: any;
  public otherFilters: OtherFilters; 

  public get dropdownSettings() {
    return this._dropdownSettings;
  }

  @Input() value;
  @Input() enabled = true;
  model = {
    left: true,
    middle: false,
    right: false
  };

  sortHotelsByPrice($event) {
    this.HttpClientService.getHotelWithinPriceRange(this.value).subscribe(hotels => {
      console.log(hotels)
      //this.HotelService.updateHotelList(hotels);
    })
  }

  constructor(private HttpClientService: HttpClientService, private HotelService: HotelService) {

    this._dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 14,
      allowSearchFilter: true
    };
    this.activities = ["Gym", "Running", "Open bar"];
    this.locations = ["Graz", "Vienna", "Salzburg"];
    this.selectedActivities = [];
    this.otherFilters = new OtherFilters();
  }

  public selectActivities() {
    this.selectedActivities.push(this.currentlySelectedActivities);
  }

  public sortHotelsByActivity() {
    this.HttpClientService.getHotelWithActivities(this.selectedActivities).subscribe(hotels => {
      this.HotelService.updateHotelList(hotels);
    })
  }

  public applyAllFilters() {
    // object filled with all filters from frontend
    var filterModel = new FiltersModel(
        this.minPrice,
        this.maxPrice,
        this.minRating,
        this.maxRating,
        this.starsFilter,
        this.currentlySelectedActivities, 
        this.currentlySelectedLocations,
        this.otherFilters);

    // send this filtersModel to backend and recieve list of categories with filtered hotels, then emit this list
    var filteredCategoriesList = [];
    this.filteredCategories.emit(filteredCategoriesList);
  }
}
