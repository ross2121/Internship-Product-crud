"use client"
import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, Edit2, Filter, Search, Trash } from "lucide-react"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Backend_url } from "@/Backendurl"

interface Product {
  id: string
  name: string
  description: string
  Price: number
  rating: number
  SKU: string
  category?: string
  createdby: string
  createdAt: string
  updatedAt: string
}

// Sample categories for filtering
const CATEGORIES = ["Electronics", "Clothing", "Home", "Books", "Sports", "Other"]

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [inputValue, setInputValue] = useState<string>("")
  const router = useRouter()

 
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [ratingFilter, setRatingFilter] = useState<number[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      const userid = localStorage.getItem("userid")
      setLoading(true)
      try {
        const response = await axios.get<Product[]>(
          `${Backend_url}/product/${userid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        console.log(response.data)
        const productsWithCategories = response.data.map((product) => ({
          ...product,
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        }))

        setProducts(productsWithCategories)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to fetch product data.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const deleteProduct = async () => {
    if (!selectedProduct) return
    try {
      await axios.delete(`${Backend_url}/delete/${selectedProduct.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setProducts(products.filter((product) => product.id !== selectedProduct.id))
      toast("Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product", error)
      toast.error("Error deleting product")
    } finally {
      setLoading(false)
    }
  }
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategoryFilter([...categoryFilter, category])
    } else {
      setCategoryFilter(categoryFilter.filter((c) => c !== category))
    }
  }
  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setRatingFilter([...ratingFilter, rating])
    } else {
      setRatingFilter(ratingFilter.filter((r) => r !== rating))
    }
  }
  const filteredAndSortedProducts = products
    .filter((product) => {
      const searchMatch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const priceMatch = product.Price >= priceRange[0] && product.Price <= priceRange[1]
      const categoryMatch =
        categoryFilter.length === 0 || (product.category && categoryFilter.includes(product.category))
      const ratingMatch = ratingFilter.length === 0 || ratingFilter.includes(Math.floor(product.rating))

      return searchMatch && priceMatch && categoryMatch && ratingMatch
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "price") {
        return sortDirection === "asc" ? a.Price - b.Price : b.Price - a.Price
      } else if (sortField === "rating") {
        return sortDirection === "asc" ? a.rating - b.rating : b.rating - a.rating
      }
      return 0
    })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)
  const isDeleteEnabled = selectedProduct && inputValue === selectedProduct.name

  
  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 1000])
    setRatingFilter([])
    setCategoryFilter([])
    setSortField("name")
    setSortDirection("asc")
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <Table>
        <TableCaption className="mt-16">List of Products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sl.no</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 7 }).map((__, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-6 w-full rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex justify-center my-9">List of Products</h2>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by product name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-muted/40 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="space-y-2">
              <h4 className="font-medium">Price Range</h4>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 1000]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={(value:number[]) => setPriceRange(value as [number, number])}
                  className="my-6"
                />
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Categories</h4>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={categoryFilter.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Rating</h4>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={ratingFilter.includes(rating)}
                      onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                    />
                    <Label htmlFor={`rating-${rating}`}>
                      {rating} Star{rating !== 1 ? "s" : ""} & Above
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableCaption className="mt-4">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAndSortedProducts.length)} of{" "}
            {filteredAndSortedProducts.length} products
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Sl.no</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("name")}>
                  Name
                  {sortField === "name" && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("price")}>
                  Price
                  {sortField === "price" && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("rating")}>
                  Rating
                  {sortField === "rating" && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No products found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell className="font-semibold">
                    <Link href={`/admin/chart/${product.id}`}>
                      <span className="text-blue-600 hover:underline">{product.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{product.description}</TableCell>
                  <TableCell>${product.Price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {product.rating.toFixed(1)}
                      <div className="ml-2 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => router.push(`/Admin/Update/${product.id}`)}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <div>
                        <Drawer>
                          <DrawerTrigger asChild>
                            <div
                              onClick={() => setSelectedProduct(product)}
                              className="cursor-pointer text-red-500 hover:underline"
                            >
                              <Trash className="w-5 h-5" />
                            </div>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Are you sure you want to delete the product {product.name}?</DrawerTitle>
                              <DrawerDescription>This action cannot be undone.</DrawerDescription>
                            </DrawerHeader>
                            <div className="my-4 px-4">
                              <Input
                                type="text"
                                placeholder="Type product name to confirm"
                                value={inputValue}
                                onChange={handleInputChange}
                              />
                            </div>
                            <DrawerFooter>
                              <Button
                                variant="destructive"
                                disabled={!isDeleteEnabled}
                                onClick={deleteProduct}
                                className="w-36 flex justify-center items-center gap-2"
                              >
                                {loading ? "Deleting..." : "Delete Product"}
                                <Trash className="w-4 h-4" />
                              </Button>
                              <DrawerClose asChild>
                                <Button variant="outline" className="w-28">
                                  Cancel
                                </Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pageNumbers.map((number) => (
              <PaginationItem key={number}>
                <PaginationLink isActive={currentPage === number} onClick={() => setCurrentPage(number)}>
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ToastContainer />
    </div>
  )
}

export default ProductList
