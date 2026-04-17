package com.ecommerce.project.algorithm;

import com.ecommerce.project.model.Product;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ProductSortSearchUtil {

    // ===== QUICK SORT =====
    // Sort products by price, name, or discount
    // Time complexity: O(n log n) average, O(n^2) worst case
    // Space complexity: O(log n) due to recursion stack

    public static void quickSort(
            List<Product> products,
            int low,
            int high,
            String sortBy,
            String order) {

        if (low < high) {
            int pivotIndex = partition(
                products, low, high, sortBy, order);
            quickSort(
                products, low,
                pivotIndex - 1, sortBy, order);
            quickSort(
                products, pivotIndex + 1,
                high, sortBy, order);
        }
    }

    private static int partition(
            List<Product> products,
            int low,
            int high,
            String sortBy,
            String order) {

        Product pivot = products.get(high);
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (compareProducts(
                    products.get(j),
                    pivot, sortBy, order)) {
                i++;
                Collections.swap(products, i, j);
            }
        }
        Collections.swap(products, i + 1, high);
        return i + 1;
    }

    private static boolean compareProducts(
            Product a,
            Product b,
            String sortBy,
            String order) {

        switch (sortBy.toLowerCase()) {
            case "price":
                double priceA = a.getSpecialPrice() > 0
                    ? a.getSpecialPrice() : a.getPrice();
                double priceB = b.getSpecialPrice() > 0
                    ? b.getSpecialPrice() : b.getPrice();
                return order.equalsIgnoreCase("asc")
                    ? priceA <= priceB
                    : priceA >= priceB;

            case "discount":
                return order.equalsIgnoreCase("asc")
                    ? a.getDiscount() <= b.getDiscount()
                    : a.getDiscount() >= b.getDiscount();

            case "name":
            default:
                int cmp = a.getProductName()
                    .compareToIgnoreCase(
                        b.getProductName());
                return order.equalsIgnoreCase("asc")
                    ? cmp <= 0
                    : cmp >= 0;
        }
    }

    // ===== BINARY SEARCH =====
    // Search products by keyword in name
    // List must be sorted by name first before calling this
    // Time complexity: O(log n) to find first match + O(k) to collect neighbors
    // Space complexity: O(k) where k = number of matches

    public static List<Product> binarySearch(
            List<Product> sortedProducts,
            String keyword) {

        if (keyword == null || keyword.isEmpty()) {
            return sortedProducts;
        }

        List<Product> result = new ArrayList<>();
        String lowerKeyword = keyword.toLowerCase();
        int low = 0;
        int high = sortedProducts.size() - 1;
        int matchIndex = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            String midName = sortedProducts
                .get(mid)
                .getProductName()
                .toLowerCase();

            if (midName.contains(lowerKeyword)) {
                matchIndex = mid;
                break;
            } else if (midName.compareTo(
                    lowerKeyword) < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        if (matchIndex == -1) return result;

        result.add(sortedProducts.get(matchIndex));

        int left = matchIndex - 1;
        while (left >= 0 &&
            sortedProducts.get(left)
                .getProductName()
                .toLowerCase()
                .contains(lowerKeyword)) {
            result.add(sortedProducts.get(left));
            left--;
        }

        int right = matchIndex + 1;
        while (right < sortedProducts.size() &&
            sortedProducts.get(right)
                .getProductName()
                .toLowerCase()
                .contains(lowerKeyword)) {
            result.add(sortedProducts.get(right));
            right++;
        }

        return result;
    }
}
