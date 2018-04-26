import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../auth/services/auth.service';
import { Category } from '../models/category';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class CategoryService {
  
  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private afdb: AngularFireDatabase,
  ) { }

  getRootCategories$() {
    return this.afdb.list<Category>(`${this.authService.authUser.uid}/categories`).valueChanges().map((categories: Category[]) => {
      return categories.filter((category: Category) => {
        return (category.parentCategoryId === undefined) || (category.parentCategoryId == null);
      })
    });
  }

  getAllCategories$() {
    return this.afdb.list<Category>(`${this.authService.authUser.uid}/categories`).valueChanges();
  }

  createLinkCategory(category: Category, parentCategoryId?) {
    let dbRef = this.afdb.database.ref(this.authService.authUser.uid + '/categories');
    let newCategory = dbRef.push();
    newCategory.set ({
        title: category.title,
        id: newCategory.key,
        linkCount: 0,
        parentCategoryId: (parentCategoryId !== undefined && parentCategoryId !== null)? parentCategoryId : null
    });
  }

  updateCategory(categoryId, categoryTitle) {
    this.afdb.database.ref(`${this.authService.authUser.uid}/categories`).child(categoryId)
    .update({
        title: categoryTitle
    })
    .then(()=>{
      this.snackBar.open('Update Successful', '', {
        duration: 2000,
    });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  deleteLinkCategory(categoryId: string) {
    this.afdb.list(`${this.authService.authUser.uid}/categories/${categoryId}`).remove();
    this.afdb.list(`${this.authService.authUser.uid}/links/${categoryId}`).remove();
    this.deleteLinkSubCategories(categoryId)
      .then(() => {
        this.snackBar.open('Delete Successful', '', {
          duration: 2000,
      });
      });
  }

  deleteLinkSubCategories(parentCategoryId: string) {
    return this.afdb.database.ref(`${this.authService.authUser.uid}/categories`).once('value', (snapShot) => {
      let categoryObjects = snapShot.val();

      for (const categoryId in categoryObjects) {
        if (categoryObjects.hasOwnProperty(categoryId)) {
          if (categoryObjects[categoryId].parentCategoryId == parentCategoryId) {
            this.deleteLinkCategory(categoryObjects[categoryId].id);
          }
        }
      }
    });
  }

  moveCategory(categoryId, parentCategoryId: string) {
    this.afdb.database.ref(`${this.authService.authUser.uid}/categories`).child(categoryId)
    .update({
      parentCategoryId: parentCategoryId
    })
    .then(()=>{
      this.snackBar.open('Move Successful', '', {
        duration: 2000,
    });
    })
    .catch((error) => {
      console.log(error);
    });
  }
}