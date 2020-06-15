Feature: Homepage

  The homepage should have an input number for adding the card number.
  After press get balance button should show balance or show error.

  Scenario: get balance successfully
    Given I open Home page
    When the user type a card number
    And click on get balance button
    Then the user see the balance

  Scenario: get balance failing
    Given I open Home page
    When the user type a card number
    And click on get balance button for failing request
    Then the user see the error
