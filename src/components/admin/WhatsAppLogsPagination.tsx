
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

interface WhatsAppLogsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const WhatsAppLogsPagination: React.FC<WhatsAppLogsPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
            ) : (
              <Button variant="outline" size="icon" disabled className="opacity-50 cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span className="sr-only">Previous</span>
              </Button>
            )}
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            
            // Show current page, first page, last page, and one page before and after current
            if (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            
            // Show ellipsis for gaps
            if (page === 2 || page === totalPages - 1) {
              return (
                <PaginationItem key={`ellipsis-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return null;
          })}
          
          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
            ) : (
              <Button variant="outline" size="icon" disabled className="opacity-50 cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="sr-only">Next</span>
              </Button>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      <div className="text-xs text-muted-foreground text-center">
        {totalItems > 0 ? (
          <>Mostrando {Math.min(itemsPerPage, Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage))} de {totalItems} registros</>
        ) : (
          <>Nenhum registro encontrado</>
        )}
      </div>
    </>
  );
};

export default WhatsAppLogsPagination;
