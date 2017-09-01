import { Component } from '@angular/core';
import { NavigationService } from '../../navigation.service';
import { PetFinderService, AvailableValues } from 'petfinder-angular-service';

@Component({
  moduleId: module.id,
  selector: 'petbros-shelter-search',
  templateUrl: './shelter-search.component.html',
  styleUrls: ['./shelter-search.component.scss']
})
export class ShelterSearchComponent {
  public location = 'Boston, MA';
  public name = '';

  public availableValues = AvailableValues;
  public animal = '';
  public breed = '';
  public breeds: string[] = [];

  constructor(
    private navigation: NavigationService,
    private petfinderService: PetFinderService) { }

  refreshBreeds() {
    this.breed = null;
    if (this.animal) {
      this.petfinderService.breedList(this.animal)
      .then(breeds => this.breeds = breeds);
    } else {
      this.breeds = [];
    }
  }

  findShelters() {
    const navigationExtras = {
      queryParams: {
        searchByBreed: false,
        location: this.location,
        name: this.name
      }
    };
    this.navigation.navigate(['shelterSearch/results'], navigationExtras);
  }

  findSheltersByBreed() {
    const navigationExtras = {
      queryParams: {
        searchByBreed: true,
        animal: this.animal,
        breed: this.breed
      }
    };
    this.navigation.navigate(['shelterSearch/results'], navigationExtras);
  }

}
