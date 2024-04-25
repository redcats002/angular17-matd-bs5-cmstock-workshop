import { Product } from '@/models/product.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NetworkService } from 'app/services/network.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stock-edit',
  templateUrl: './stock-edit.component.html',
  styleUrl: './stock-edit.component.css',
})
export class StockEditComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        alert(params['id']);
      },
    });
  }

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
