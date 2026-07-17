/*
 * =====================================================================================
 *  Console-Based Library Management System
 * =====================================================================================
 *  Description : A single-file, production-ready C++ console application for managing
 *                a library's book inventory and transactions (issue/return).
 *
 *  Architecture:
 *      - Book            : Plain data/model class representing a single book.
 *      - LibraryManager  : Core service class that owns all books, exposes CRUD +
 *                          transaction operations, and handles file persistence.
 *      - main()          : Thin presentation/UI layer (console menu) that talks only
 *                          to LibraryManager - no business logic lives in main().
 *
 *  STL Usage:
 *      - std::map<int, Book>          -> Primary storage, keyed by unique Book ID
 *                                         (fast O(log n) lookup/insert/delete by ID).
 *      - std::map<std::string, int>   -> Secondary index mapping ISBN -> Book ID,
 *                                         giving O(log n) ISBN lookups without
 *                                         duplicating book data.
 *      - std::vector<Book>            -> Used as a temporary "view" of the books when
 *                                         we need to sort them for display purposes
 *                                         (std::sort requires random-access iterators,
 *                                         which std::map cannot provide directly).
 *      - std::fstream                 -> All persistence (save/load) to a local text
 *                                         file, using a simple pipe-delimited format.
 *
 *  Persistence format (one book per line):
 *      id|title|author|isbn|totalQuantity|availableQuantity
 *
 *  Compile:
 *      g++ -std=c++17 -O2 -Wall -o library LibraryManagementSystem.cpp
 *
 *  Run:
 *      ./library
 * =====================================================================================
 */

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <map>
#include <string>
#include <algorithm>
#include <limits>
#include <iomanip>

// =====================================================================================
//  CLASS: Book
// =====================================================================================
//  Represents a single book entity in the library. Deliberately kept as a small,
//  self-contained data class (encapsulated fields + getters/setters) so it can be
//  freely copied into vectors for sorting/display without affecting the master
//  copies held inside LibraryManager's maps.
// =====================================================================================
class Book
{
private:
    int id;                    // Unique, system-generated identifier (primary key)
    std::string title;         // Book title
    std::string author;        // Book author
    std::string isbn;          // International Standard Book Number (unique)
    int totalQuantity;         // Total copies owned by the library
    int availableQuantity;     // Copies currently available (not issued out)

public:
    // Default constructor required so Book can live inside STL containers
    // (e.g. std::map's operator[] default-constructs values).
    Book()
        : id(0), title(""), author(""), isbn(""), totalQuantity(0), availableQuantity(0)
    {
    }

    // Fully-parameterized constructor used when adding a brand-new book.
    Book(int id_, const std::string& title_, const std::string& author_,
         const std::string& isbn_, int quantity_)
        : id(id_), title(title_), author(author_), isbn(isbn_),
          totalQuantity(quantity_), availableQuantity(quantity_)
    {
    }

    // ---- Getters ----
    int getId() const { return id; }
    std::string getTitle() const { return title; }
    std::string getAuthor() const { return author; }
    std::string getIsbn() const { return isbn; }
    int getTotalQuantity() const { return totalQuantity; }
    int getAvailableQuantity() const { return availableQuantity; }

    // Human-readable status derived from availableQuantity.
    std::string getStatus() const
    {
        return (availableQuantity > 0) ? "Available" : "Issued Out (0 left)";
    }

    // ---- Setters ----
    void setTitle(const std::string& t) { title = t; }
    void setAuthor(const std::string& a) { author = a; }
    void setTotalQuantity(int q) { totalQuantity = q; }
    void setAvailableQuantity(int q) { availableQuantity = q; }

    // Decrements available copies when a book is issued.
    // Returns false if no copies are currently available.
    bool issueCopy()
    {
        if (availableQuantity <= 0)
            return false;
        --availableQuantity;
        return true;
    }

    // Increments available copies when a book is returned.
    // Returns false if doing so would exceed the total owned quantity
    // (guards against "returning" a book that was never issued).
    bool returnCopy()
    {
        if (availableQuantity >= totalQuantity)
            return false;
        ++availableQuantity;
        return true;
    }

    // Serializes this book into a single pipe-delimited line for file storage.
    std::string toFileString() const
    {
        std::ostringstream oss;
        oss << id << '|' << title << '|' << author << '|' << isbn << '|'
            << totalQuantity << '|' << availableQuantity;
        return oss.str();
    }

    // Reconstructs a Book from a pipe-delimited line previously written by
    // toFileString(). Returns true on success, false if the line is malformed
    // (so the caller can skip corrupt lines instead of crashing).
    static bool fromFileString(const std::string& line, Book& outBook)
    {
        std::vector<std::string> fields;
        std::stringstream ss(line);
        std::string field;

        while (std::getline(ss, field, '|'))
            fields.push_back(field);

        if (fields.size() != 6)
            return false; // Malformed line - not enough/too many fields

        try
        {
            outBook.id = std::stoi(fields[0]);
            outBook.title = fields[1];
            outBook.author = fields[2];
            outBook.isbn = fields[3];
            outBook.totalQuantity = std::stoi(fields[4]);
            outBook.availableQuantity = std::stoi(fields[5]);
        }
        catch (const std::exception&)
        {
            return false; // Non-numeric data where a number was expected
        }

        return true;
    }

    // Prints a single formatted row describing this book (used by display routines).
    void printRow() const
    {
        std::cout << std::left
                  << std::setw(5)  << id
                  << std::setw(30) << title
                  << std::setw(20) << author
                  << std::setw(16) << isbn
                  << std::setw(8)  << totalQuantity
                  << std::setw(10) << availableQuantity
                  << getStatus()
                  << '\n';
    }

    // Prints the column header matching printRow()'s layout.
    static void printHeader()
    {
        std::cout << std::left
                  << std::setw(5)  << "ID"
                  << std::setw(30) << "Title"
                  << std::setw(20) << "Author"
                  << std::setw(16) << "ISBN"
                  << std::setw(8)  << "Total"
                  << std::setw(10) << "Avail."
                  << "Status" << '\n';
        std::cout << std::string(95, '-') << '\n';
    }
};

// =====================================================================================
//  CLASS: LibraryManager
// =====================================================================================
//  Owns the entire in-memory book collection and is the single source of truth for
//  all business logic: adding, deleting, searching, issuing, returning, sorting and
//  persisting books. The console UI (main) never manipulates Book objects directly -
//  it only calls into LibraryManager's public API.
// =====================================================================================
class LibraryManager
{
private:
    std::map<int, Book> booksById;         // Primary store: ID -> Book
    std::map<std::string, int> isbnToId;   // Secondary index: ISBN -> ID
    int nextId;                            // Auto-incrementing ID generator
    std::string dataFileName;              // Path to the persistence file

    // Builds a std::vector<Book> snapshot from the map so we can run std::sort
    // on it. std::map keeps entries sorted by key (ID) at all times, but we
    // frequently need a *different* ordering (by title/author), and std::sort
    // needs random-access iterators that std::map does not provide - hence the
    // copy into a vector.
    std::vector<Book> getAllBooksAsVector() const
    {
        std::vector<Book> result;
        result.reserve(booksById.size());
        for (const auto& pair : booksById)
            result.push_back(pair.second);
        return result;
    }

public:
    // Constructor loads any previously saved data immediately so the library's
    // state is restored as soon as the manager is created.
    explicit LibraryManager(const std::string& fileName)
        : nextId(1), dataFileName(fileName)
    {
        loadFromFile();
    }

    // Destructor guarantees data is flushed to disk even if the user forgets
    // to explicitly save (defensive persistence).
    ~LibraryManager()
    {
        saveToFile();
    }

    // -----------------------------------------------------------------------
    //  Persistence
    // -----------------------------------------------------------------------

    // Loads book records from dataFileName into memory. If the file does not
    // exist yet (e.g. first run), this is treated as "start with an empty
    // library" rather than an error.
    void loadFromFile()
    {
        std::ifstream inFile(dataFileName);
        if (!inFile.is_open())
        {
            // No existing data file - nothing to load, not an error condition.
            return;
        }

        std::string line;
        int highestIdSeen = 0;

        while (std::getline(inFile, line))
        {
            if (line.empty())
                continue; // Skip blank lines gracefully

            Book book;
            if (Book::fromFileString(line, book))
            {
                booksById[book.getId()] = book;
                isbnToId[book.getIsbn()] = book.getId();
                highestIdSeen = std::max(highestIdSeen, book.getId());
            }
            // Malformed lines are silently skipped rather than crashing the app.
        }

        inFile.close();
        nextId = highestIdSeen + 1; // Resume ID sequence from where we left off
    }

    // Writes the entire in-memory collection back out to dataFileName,
    // overwriting any previous contents. Uses std::ios::trunc implicitly via
    // default ofstream open mode.
    bool saveToFile() const
    {
        std::ofstream outFile(dataFileName, std::ios::trunc);
        if (!outFile.is_open())
        {
            std::cerr << "Error: Could not open '" << dataFileName
                      << "' for saving.\n";
            return false;
        }

        for (const auto& pair : booksById)
            outFile << pair.second.toFileString() << '\n';

        outFile.close();
        return true;
    }

    // -----------------------------------------------------------------------
    //  Book Management
    // -----------------------------------------------------------------------

    // Adds a new book. Rejects duplicate ISBNs to keep the ISBN index unique
    // and unambiguous.
    bool addBook(const std::string& title, const std::string& author,
                 const std::string& isbn, int quantity)
    {
        if (isbnToId.find(isbn) != isbnToId.end())
        {
            std::cout << "A book with ISBN " << isbn
                      << " already exists. Use 'Issue' to add more readers,"
                      << " or edit the quantity manually.\n";
            return false;
        }

        int newId = nextId++;
        Book newBook(newId, title, author, isbn, quantity);
        booksById[newId] = newBook;
        isbnToId[isbn] = newId;
        return true;
    }

    // Deletes a book by its ISBN. Returns true if a matching book was found
    // and removed.
    bool deleteByIsbn(const std::string& isbn)
    {
        auto idxIt = isbnToId.find(isbn);
        if (idxIt == isbnToId.end())
            return false;

        int id = idxIt->second;
        booksById.erase(id);
        isbnToId.erase(idxIt);
        return true;
    }

    // Deletes a book by title. Since titles are not guaranteed unique, this
    // deletes the FIRST matching title it finds and reports how many total
    // matches existed, so the librarian is aware of ambiguity.
    bool deleteByTitle(const std::string& title, int& remainingMatches)
    {
        remainingMatches = 0;
        int idToDelete = -1;
        std::string isbnToDelete;

        for (const auto& pair : booksById)
        {
            if (pair.second.getTitle() == title)
            {
                if (idToDelete == -1)
                {
                    idToDelete = pair.first;
                    isbnToDelete = pair.second.getIsbn();
                }
                else
                {
                    ++remainingMatches; // Additional matches beyond the first
                }
            }
        }

        if (idToDelete == -1)
            return false; // No match found at all

        booksById.erase(idToDelete);
        isbnToId.erase(isbnToDelete);
        return true;
    }

    // -----------------------------------------------------------------------
    //  Search
    // -----------------------------------------------------------------------

    // Searches by exact ISBN using the O(log n) index - the fastest lookup path.
    bool searchByIsbn(const std::string& isbn, Book& outBook) const
    {
        auto idxIt = isbnToId.find(isbn);
        if (idxIt == isbnToId.end())
            return false;

        auto bookIt = booksById.find(idxIt->second);
        if (bookIt == booksById.end())
            return false; // Should not happen if index is consistent

        outBook = bookIt->second;
        return true;
    }

    // Searches by title (case-sensitive substring match) across all books.
    // Returns every book whose title contains the search term.
    std::vector<Book> searchByTitle(const std::string& titleQuery) const
    {
        std::vector<Book> matches;
        for (const auto& pair : booksById)
        {
            if (pair.second.getTitle().find(titleQuery) != std::string::npos)
                matches.push_back(pair.second);
        }
        return matches;
    }

    // Searches by author (case-sensitive substring match) across all books.
    std::vector<Book> searchByAuthor(const std::string& authorQuery) const
    {
        std::vector<Book> matches;
        for (const auto& pair : booksById)
        {
            if (pair.second.getAuthor().find(authorQuery) != std::string::npos)
                matches.push_back(pair.second);
        }
        return matches;
    }

    // -----------------------------------------------------------------------
    //  Transactions
    // -----------------------------------------------------------------------

    // Issues one copy of the book identified by ISBN.
    // Return codes: 0 = success, 1 = ISBN not found, 2 = no copies available.
    int issueBookByIsbn(const std::string& isbn)
    {
        auto idxIt = isbnToId.find(isbn);
        if (idxIt == isbnToId.end())
            return 1;

        Book& book = booksById[idxIt->second];
        if (!book.issueCopy())
            return 2;

        return 0;
    }

    // Returns one copy of the book identified by ISBN.
    // Return codes: 0 = success, 1 = ISBN not found, 2 = all copies already accounted for.
    int returnBookByIsbn(const std::string& isbn)
    {
        auto idxIt = isbnToId.find(isbn);
        if (idxIt == isbnToId.end())
            return 1;

        Book& book = booksById[idxIt->second];
        if (!book.returnCopy())
            return 2;

        return 0;
    }

    // -----------------------------------------------------------------------
    //  Display / Sorting
    // -----------------------------------------------------------------------

    // Prints all books, sorted according to the requested field.
    // sortField: 1 = by Title, 2 = by Author, anything else = by ID (default map order).
    void displayAllSorted(int sortField) const
    {
        if (booksById.empty())
        {
            std::cout << "The library currently has no books in its catalog.\n";
            return;
        }

        std::vector<Book> books = getAllBooksAsVector();

        if (sortField == 1)
        {
            // Sort by Title using a lambda comparator with std::sort - O(n log n).
            std::sort(books.begin(), books.end(),
                      [](const Book& a, const Book& b)
                      {
                          return a.getTitle() < b.getTitle();
                      });
        }
        else if (sortField == 2)
        {
            // Sort by Author.
            std::sort(books.begin(), books.end(),
                      [](const Book& a, const Book& b)
                      {
                          return a.getAuthor() < b.getAuthor();
                      });
        }
        // else: leave in natural ID order already provided by the map.

        Book::printHeader();
        for (const auto& b : books)
            b.printRow();
    }

    // Utility for the UI layer to know whether the catalog is empty.
    bool isEmpty() const { return booksById.empty(); }

    // Returns the total number of distinct book entries (not physical copies).
    size_t bookCount() const { return booksById.size(); }
};

// =====================================================================================
//  Console UI Helper Functions
// =====================================================================================

// Prompts the user for an integer within [minVal, maxVal], re-prompting on any
// invalid input (non-numeric input, out-of-range input, or trailing garbage).
// This is the key safeguard against infinite loops / crashes caused by bad
// menu input - std::cin's failbit is cleared and the bad input is discarded
// on every failure before looping again.
int getValidatedIntInput(const std::string& prompt, int minVal, int maxVal)
{
    int value;
    while (true)
    {
        std::cout << prompt;
        std::cin >> value;

        if (std::cin.fail())
        {
            // Non-numeric input was entered (e.g. letters).
            std::cin.clear(); // Reset the failbit so the stream is usable again
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // Discard bad input
            std::cout << "Invalid input. Please enter a whole number.\n";
            continue;
        }

        // Discard anything left on the line (e.g. "3 extra text") so it does
        // not corrupt the next std::getline call.
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

        if (value < minVal || value > maxVal)
        {
            std::cout << "Please enter a number between " << minVal
                      << " and " << maxVal << ".\n";
            continue;
        }

        return value; // Valid input obtained
    }
}

// Prompts for a non-empty line of text, re-prompting until something is entered.
std::string getValidatedLineInput(const std::string& prompt)
{
    std::string line;
    while (true)
    {
        std::cout << prompt;
        std::getline(std::cin, line);

        if (line.empty())
        {
            std::cout << "This field cannot be empty. Please try again.\n";
            continue;
        }
        return line;
    }
}

// Prompts for a positive integer quantity (>= 1), reusing the same robust
// validation approach as getValidatedIntInput but with an open-ended upper bound.
int getValidatedQuantityInput(const std::string& prompt)
{
    return getValidatedIntInput(prompt, 1, 1000000);
}

// Prints a single Book in a labeled, detailed format (used after single-record searches).
void printBookDetails(const Book& b)
{
    std::cout << "  ID:        " << b.getId() << '\n'
              << "  Title:     " << b.getTitle() << '\n'
              << "  Author:    " << b.getAuthor() << '\n'
              << "  ISBN:      " << b.getIsbn() << '\n'
              << "  Total Qty: " << b.getTotalQuantity() << '\n'
              << "  Available: " << b.getAvailableQuantity() << '\n'
              << "  Status:    " << b.getStatus() << '\n';
}

void printMainMenu()
{
    std::cout << "\n=========================================\n"
              << "   LIBRARY MANAGEMENT SYSTEM\n"
              << "=========================================\n"
              << " 1. Add New Book\n"
              << " 2. Delete Book (by ISBN)\n"
              << " 3. Delete Book (by Title)\n"
              << " 4. Search Book (by Title)\n"
              << " 5. Search Book (by Author)\n"
              << " 6. Search Book (by ISBN)\n"
              << " 7. Issue Book\n"
              << " 8. Return Book\n"
              << " 9. Display All Books (by ID order)\n"
              << "10. Display All Books (sorted by Title)\n"
              << "11. Display All Books (sorted by Author)\n"
              << "12. Save Library Data Now\n"
              << " 0. Save & Exit\n"
              << "=========================================\n";
}

// =====================================================================================
//  main()
// =====================================================================================
//  Pure presentation layer: renders the menu, collects validated input, and
//  delegates every piece of actual work to LibraryManager. No business rules
//  live here.
// =====================================================================================
int main()
{
    const std::string DATA_FILE = "library_data.txt";
    LibraryManager manager(DATA_FILE);

    std::cout << "Library data loaded. Currently tracking "
              << manager.bookCount() << " distinct title(s).\n";

    bool running = true;
    while (running)
    {
        printMainMenu();
        int choice = getValidatedIntInput("Enter your choice: ", 0, 12);

        switch (choice)
        {
            case 1: // Add New Book
            {
                std::string title = getValidatedLineInput("Enter Title: ");
                std::string author = getValidatedLineInput("Enter Author: ");
                std::string isbn = getValidatedLineInput("Enter ISBN: ");
                int qty = getValidatedQuantityInput("Enter Quantity: ");

                if (manager.addBook(title, author, isbn, qty))
                    std::cout << "Book added successfully.\n";
                break;
            }

            case 2: // Delete by ISBN
            {
                std::string isbn = getValidatedLineInput("Enter ISBN to delete: ");
                if (manager.deleteByIsbn(isbn))
                    std::cout << "Book deleted successfully.\n";
                else
                    std::cout << "No book found with that ISBN.\n";
                break;
            }

            case 3: // Delete by Title
            {
                std::string title = getValidatedLineInput("Enter Title to delete: ");
                int remaining = 0;
                if (manager.deleteByTitle(title, remaining))
                {
                    std::cout << "Book deleted successfully.\n";
                    if (remaining > 0)
                        std::cout << "Note: " << remaining
                                  << " other book(s) with the same title still remain.\n";
                }
                else
                {
                    std::cout << "No book found with that title.\n";
                }
                break;
            }

            case 4: // Search by Title
            {
                std::string query = getValidatedLineInput("Enter Title (or part of it) to search: ");
                std::vector<Book> results = manager.searchByTitle(query);
                if (results.empty())
                {
                    std::cout << "No books matched that title.\n";
                }
                else
                {
                    std::cout << "Found " << results.size() << " match(es):\n";
                    for (const auto& b : results)
                    {
                        printBookDetails(b);
                        std::cout << "  ---------------------------\n";
                    }
                }
                break;
            }

            case 5: // Search by Author
            {
                std::string query = getValidatedLineInput("Enter Author (or part of it) to search: ");
                std::vector<Book> results = manager.searchByAuthor(query);
                if (results.empty())
                {
                    std::cout << "No books matched that author.\n";
                }
                else
                {
                    std::cout << "Found " << results.size() << " match(es):\n";
                    for (const auto& b : results)
                    {
                        printBookDetails(b);
                        std::cout << "  ---------------------------\n";
                    }
                }
                break;
            }

            case 6: // Search by ISBN
            {
                std::string isbn = getValidatedLineInput("Enter ISBN to search: ");
                Book found;
                if (manager.searchByIsbn(isbn, found))
                    printBookDetails(found);
                else
                    std::cout << "No book found with that ISBN.\n";
                break;
            }

            case 7: // Issue Book
            {
                std::string isbn = getValidatedLineInput("Enter ISBN of book to issue: ");
                int result = manager.issueBookByIsbn(isbn);
                if (result == 0)
                    std::cout << "Book issued successfully.\n";
                else if (result == 1)
                    std::cout << "No book found with that ISBN.\n";
                else
                    std::cout << "Sorry, no copies of this book are currently available.\n";
                break;
            }

            case 8: // Return Book
            {
                std::string isbn = getValidatedLineInput("Enter ISBN of book to return: ");
                int result = manager.returnBookByIsbn(isbn);
                if (result == 0)
                    std::cout << "Book returned successfully.\n";
                else if (result == 1)
                    std::cout << "No book found with that ISBN.\n";
                else
                    std::cout << "Error: all copies are already marked as available "
                              << "(cannot exceed total owned quantity).\n";
                break;
            }

            case 9: // Display all (ID order)
                manager.displayAllSorted(0);
                break;

            case 10: // Display sorted by Title
                manager.displayAllSorted(1);
                break;

            case 11: // Display sorted by Author
                manager.displayAllSorted(2);
                break;

            case 12: // Manual save
                if (manager.saveToFile())
                    std::cout << "Library data saved to '" << DATA_FILE << "'.\n";
                break;

            case 0: // Save & Exit
                manager.saveToFile();
                std::cout << "Library data saved. Goodbye!\n";
                running = false;
                break;

            default:
                // Unreachable because getValidatedIntInput already enforces
                // the [0, 12] range, but kept for defensive completeness.
                std::cout << "Unexpected choice.\n";
                break;
        }
    }

    return 0;
}
