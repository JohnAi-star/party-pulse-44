import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { suppliers } from '@/lib/api-client';

interface Supplier {
  id: string;
  name: string;
  type: string;
  contact_name: string;
  email: string;
  phone: string;
  services: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>;
}

interface SupplierListProps {
  partyPlanId: string;
  onBookService: (serviceId: string) => void;
}

export default function SupplierList({ partyPlanId, onBookService }: SupplierListProps) {
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await suppliers.getAll();
      setSupplierList(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch suppliers",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = supplierList.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <CardTitle>{supplier.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <p className="text-sm text-muted-foreground">{supplier.type}</p>
                </div>
                
                <div>
                  <Label>Contact</Label>
                  <p className="text-sm text-muted-foreground">
                    {supplier.contact_name}<br />
                    {supplier.email}<br />
                    {supplier.phone}
                  </p>
                </div>

                <div>
                  <Label>Services</Label>
                  <div className="grid gap-2 mt-2">
                    {supplier.services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">£{service.price}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onBookService(service.id)}
                          >
                            Book Service
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSuppliers.length === 0 && (
          <p className="text-center text-muted-foreground">
            No suppliers found matching your search
          </p>
        )}
      </div>
    </div>
  );
}