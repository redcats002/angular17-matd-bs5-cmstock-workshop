import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Product, ProductResponse } from '@/models/product.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NetworkService } from 'app/services/network.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-home',
  templateUrl: './stock-home.component.html',
  styleUrl: './stock-home.component.css',
})
export class StockHomeComponent implements OnInit {
  constructor(private networkService: NetworkService) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['image', 'name', 'price', 'stock', 'action'];
  dataSource = new MatTableDataSource<Product>();
  textSearch: string = '';
  getData() {
    this.networkService.getProducts().subscribe({
      next: (data) => {
        this.dataSource.data = data.map((product) => {
          return {
            ...product,
            image: this.networkService.getProductImageURL(product.image),
          };
        });
      },

      error: (errorObj) => {
        alert(errorObj.error.message);
      },
      complete: () => {
        console.log('Feed network done');
      },
    });
  }
  search(event: Event | null) {
    let filterValue = '';
    if (event) filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  clearSearch() {
    this.textSearch = '';
    this.search(null);
  }

  onClickDeleteProduct(data: ProductResponse) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete Product ${data.name}`,
      icon: 'warning',
      confirmButtonText: 'Yes, delete it!',
      showCancelButton: true,
    }).then((res) => {
      if (res.value) {
        this.networkService.deleteProduct(data.id).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Deleted!',
              text: `Your Product has been deleted`,
              icon: 'success',
            });
            this.getData();
          },
          error: (errorObj) => {
            alert(errorObj.error.message);
          },
        });
      }
    });
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getData();
  }
}
