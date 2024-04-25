import { Product } from '@/models/product.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private location: Location,
    private router: Router
  ) {}

  @ViewChild('productForm') productForm!: NgForm;
  imagePreview: string | ArrayBuffer | null = '';
  file?: File;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.getData(params['id']);
      },
    });
  }

  getData(id: number) {
    this.networkService.getProductById(id).subscribe({
      next: (data) => {
        if (!this.productForm) return;
        const { id, name, price, stock, image } = { ...data };
        this.imagePreview = this.networkService.getProductImageURL(image);
        this.productForm.setValue({
          id: id,
          name: name,
          stock: stock,
          price: price,
        });
      },
      error: (errorObj) => {
        console.log(JSON.stringify(errorObj.error.message));
        this.router.navigate(['stock']);
      },
    });
  }

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
    this.networkService.editProduct(values.id, product).subscribe({
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
