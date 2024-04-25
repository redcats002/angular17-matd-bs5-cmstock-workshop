import { Product } from '@/models/product.model';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NetworkService } from 'app/services/network.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrl: './stock-create.component.css',
})
export class StockCreateComponent {
  constructor(
    private networkService: NetworkService,
    private location: Location
  ) {}

  imagePreview: string | ArrayBuffer | null = '';
  file?: File;
  onPreviewImage(event: Event | any) {
    const metaImage = event.target.files[0];
    if (metaImage) {
      this.file = metaImage;
      const reader = new FileReader();
      reader.readAsDataURL(metaImage);
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
    }
  }
  onSubmit(productForm: NgForm) {
    if (productForm.invalid) return;
    const values = productForm.value;
    const product: Product = {
      image: this.file,
      name: values.name,
      price: values.price,
      stock: values.stock,
    };
    this.networkService.addProduct(product).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: `Your Product has been created!`,
        });
        this.location.back();
      },
      error: (errorObj) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${errorObj.error.message}`,
        });
      },
    });
  }
}
