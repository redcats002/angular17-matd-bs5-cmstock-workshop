import { Product, ProductResponse } from '@/models/product.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<ProductResponse[]> {
    return this.httpClient.get<ProductResponse[]>(`products`);
  }
  getProductById(id: number): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`products/${id}`);
  }

  getProductImageURL(image: string): string {
    if (image) {
      return `${environment.baseURL}/images/${image}`;
    }
    return `assets/images/no_photo.jpg`;
  }

  deleteProduct(id: number): Observable<any> {
    return this.httpClient.delete<any>(`products/${id}`);
  }

  addProduct(product: Product): Observable<ProductResponse> {
    return this.httpClient.post<ProductResponse>(
      `products`,
      this.makeFormData(product),
      {
        reportProgress: true,
      }
    );
  }

  editProduct(id: number, product: Product): Observable<ProductResponse> {
    return this.httpClient.put<ProductResponse>(
      `products/${id}`,
      this.makeFormData(product),
      {
        reportProgress: true,
      }
    );
  }

  makeFormData(product: Product): FormData {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', `${product.price}`);
    formData.append('stock', `${product.stock}`);
    formData.append('photo', product.image);
    return formData;
  }
}
