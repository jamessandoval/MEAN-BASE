
#############################
### F3: Criteria START
#############################

Feature: F3 - page testing
  Need to check and validate page content, images and links
  Rules:
  - Check content, images and text links and report all failures

Background:
    Given I am on "/en-us/products/building-infrastructure/hvac-tools"


  ############ Global ############
 Scenario: Does page render with URL provided?
   Then the response status code should be 200
  
  Scenario: Is there a header element and links?
   Then check "header a" element

    Scenario: Is there a footer element and links?
    Then check "footer a" element
    
  Scenario: Check if H1 exists on the page?
   Then check "h1" is not empty

  Scenario: Is the h1 element in the correct language?
    Then check "h1" elements in correct language
    Then check "h1" element is in correct language

 Scenario: Are all the images filled?
     Then I should see all images "img"

 @javascript
 Scenario: Do all links open with the correct target?
     Then link ".container a" open with correct target

 Scenario: Check if there is a description under the h1
     Then I should see an ".toc-description p"

 Scenario: Is the description in the correct language?
     Then check ".toc-description p" elements in correct language

  ############ TOP SELLERS ############
 Scenario: Validates that the h3 element "Top Sellers" exists
     Then I should see an ".pane-content h3:nth-child(1)"

 Scenario: Is the h3 element "Top Sellers" in the correct language?
     Then check ".pane-content h3:nth-child(1)" elements in correct language
    Then check ".pane-content h3:nth-child(1)" element is in correct language

 Scenario: Validates that there are no more than 3 Top seller images shown on the page
     Then check that there are no more than 3 ".pane-igcommerce-utility-product-tocs-top-sellers .toc-listing-image img"


 ############ TABS ############
 Scenario: Validates if a Products tab exists then there is content
     Then I should see "#tabs li:nth-child(1) a" with content "#tabs-1 .toc_article_card_image_large a"

 Scenario: Is the Products tab in the correct language?
     Then check "#tabs li:nth-child(1) a" elements in correct language
    Then check "#tabs li:nth-child(1) a" element is in correct language

  Scenario: Validates if a Accessories tab exists then there is content
    Then I should see "#tabs li:nth-child(2) a" with content "#tabs-2 .toc_article_card_image_large a"

 Scenario: Is the Accessories tab in the correct language?
     Then check "#tabs li:nth-child(2) a" elements in correct language
    Then check "#tabs li:nth-child(2) a" element is in correct language

 Scenario: Validates if a Kits tab exists then there is content
     Then I should see "#tabs li:nth-child(3) a" with content "#tabs-3 .toc_article_card_image_large a"

 Scenario: Is the Kits tab in the correct language?
     Then check "#tabs li:nth-child(2) a" elements in correct language
    Then check "#tabs li:nth-child(2) a" element is in correct language

 @javascript
 Scenario: Validates that the Products tab total products matches the total products listed
     Then I should see total tab "#tabs #ui-id-1 span" match the total page "#tabs-1 .toc_article_card_large a"

 @javascript
 Scenario: Validates that the Accssories tab total products matches the total products listed
     Then I should see total tab "#tabs #ui-id-2 span" match the total page "#tabs-2 .toc_article_card_large a"

 @javascript
 Scenario: Validates that the Kits tab total products matches the total products listed
    Then I should see total tab "#tabs #ui-id-3 span" match the total page "#tabs-3 .toc_article_card_large a"


  ############ TOC LIST ############
 Scenario: Validates that the Products image links and title links match
     Then links "#tabs-1 .toc-listing-image a" and links "#tabs-1 .toc_article_card_image_large a" match

 Scenario: Validates that the Accessories image links and title links match
     Then links "#tabs-2 .toc-listing-image a" and links "#tabs-2 .toc_article_card_image_large a" match

 Scenario: Validates that the Kits image links and title links match
    Then links "#tabs-3 .toc-listing-image a" and links "#tabs-3 .toc_article_card_image_large a" match

  Scenario: Validates that there is a product description under the title links for the Products Tab 
   Then I should see multiple "#tabs-1 .toc_article_card_image_large"

 Scenario: Checks correct language for product description under Products tab
     Then check "#tabs-1 .toc_article_card_image_large" elements in correct language
    Then check "#tabs-1 .toc_article_card_image_large" element is in correct language

  Scenario: Validates that there is a accessory description under the title links for the Accessories Tab
    Then I should see multiple "#tabs-2 .toc_article_card_image_large"

 Scenario: Checks correct language for product description under Accessories tab
     Then check "#tabs-2 .toc_article_card_image_large" elements in correct language
    Then check "#tabs-2 .toc_article_card_image_large" element is in correct language

  Scenario: Validates that there is a kit description under the title links for the Kits Tab
    Then I should see multiple "#tabs-3 .toc_article_card_image_large"

 Scenario: Checks correct language for product description under Kits tab
     Then check "#tabs-3 .toc_article_card_image_large" elements in correct language
    Then check "#tabs-3 .toc_article_card_image_large" element is in correct language

  ### DO NOT DELETE - CUSTOM CODE MAY BE USED ###
#  Scenario: Validates that the active left nav text matches the page title
#    Then I should see that the left nav text ".child-menu-item a.active-trail" and the page title "title" match



  


############ TAB-1 PRODUCTS PAGINATION ############
 @javascript
 Scenario: Validates that there are no more than a 10 Products shown on page
     Then I should see no more than 10 "#tabs-1 li[style=''] .toc_article_card_image_large a"

 @javascript
 Scenario: Pagination Elements do not appear if there are less than 10 Products on the first page, but do appear if there is more than 10
     Then if there are less than 10 "#tabs-1 .toc_article_card_image_large a" then there are no "#tabs-1 .pagination a"

  @javascript
  Scenario: Validates that First Page button takes the user to the first page when clicked
  #   Then click pagination first page link "#tabs-1 li[style=''] .toc_article_card_image_large a" and page should show new results

  @javascript
  Scenario: Validates that Previous Page button is present and takes the user to the Previous page when clicked
  #   Then click pagination previous link "#tabs-1 li[style=''] .toc_article_card_image_large a" and page should show new results

  @javascript
  Scenario: Validates that Next Page button is present and takes the user to the Next page when clicked
  #   Then click pagination next link "element" and page should show new results
  
  @javascript
  Scenario: Validates that Last Page button is present and takes the user to the Last page when clicked
  #   Then click pagination next link "element" and page should show new results

  @javascript
  Scenario: Checks correct language for pagination "Show all" button
  #   Then check ".pagination .toc_show_all button" elements in correct language


############ TAB-2 ACCESSORIES PAGINATION ############
 @javascript
 Scenario: Validates that there are no more than a 10 Products shown on page
    Then I should see no more than 10 "#tabs-2 li[style=''] .toc_article_card_image_large a"

  @javascript
 Scenario: Pagination Elements do not appear if there are less than 10 Products on the first page, but do appear if there is more than 10
   Then if there are less than 10 "#tabs-2 .toc_article_card_image_large a" then there are no "#tabs-2 .pagination a"

  @javascript
  Scenario: Validates that First Page button takes the user to the first page when clicked
    Then click pagination first page link "#tabs-2 li[style=''] .toc_article_card_image_large a" and page should show new results

  @javascript
  Scenario: Validates that Previous Page button is present and takes the user to the Previous page when clicked
    Then click pagination previous link "#tabs-2 li[style=''] .toc_article_card_image_large a" and page should show new results

  @javascript
  Scenario: Validates that Next Page button is present and takes the user to the Next page when clicked
    Then click pagination next link "element" and page should show new results
  
  @javascript
  Scenario: Validates that Last Page button is present and takes the user to the Last page when clicked
    Then click pagination next link "element" and page should show new results

  @javascript
  Scenario: Checks correct language for pagination "Show all" button
    Then check ".pagination .toc_show_all button" elements in correct language


  ############ TAB-3 KITS PAGINATION ############
  @javascript
  Scenario: Validates that there are no more than a 10 Products shown on page
    Then I should see no more than 10 "#tabs-3 li[style=''] .toc_article_card_image_large a"

 @javascript
 Scenario: Pagination Elements do not appear if there are less than 10 Products on the first page, but do appear if there is more than 10
     Then if there are less than 10 "#tabs-3 .toc_article_card_image_large a" then there are no "#tabs-3 .pagination a"

  @javascript
  Scenario: Validates that First Page button takes the user to the first page when clicked
    Then click pagination first page link "#tabs-3 li[style=''] .toc_article_card_image_large a" and page should show new results

  @javascript
  Scenario: Validates that Previous Page button is present and takes the user to the Previous page when clicked
    Then click pagination previous link "#tabs-3 li[style=''] .toc_article_card_image_large a" and page should show new results

  @javascript
  Scenario: Validates that Next Page button is present and takes the user to the Next page when clicked
    Then click pagination next link "element" and page should show new results
  
  @javascript
  Scenario: Validates that Last Page button is present and takes the user to the Last page when clicked
    Then click pagination next link "element" and page should show new results

  @javascript
  Scenario: Checks correct language for pagination "Show all" button
    Then check ".pagination .toc_show_all button" elements in correct language

  
#############################
### F3: Criteria STOP
#############################



############### UNABLE TO COMPLETE ###############

## Not sure how to proceed ###
#Are the links below the images in the correct language? - (Top sellers)
#BUG: Does the text underline when hover on image - it should not. - (Top sellers)
#Does the text underline when hover on text link - it should. - (Top sellers)
#Is the product title link in the correct language? - (Toc List)
