package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private  ProductService service;

//    public ProductController(ProductService service) {
//        this.service = service;
//    }

    @GetMapping("get/{pageNumber}")
    public List<Product> getAllProducts(@PathVariable int pageNumber) {
        return service.getProductByPageNumber(pageNumber);
      //  return service.getAllProducts();
    }

    @GetMapping("/count")
    public long getTotalProductCount() {
        return service.getTotalProductCount();
    }
}
