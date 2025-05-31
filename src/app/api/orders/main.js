class HashTable<T> {
    private table: { [key: string]: T } = {};

    // Adaugă o pereche cheie-valoare în tabel
    set(key: string, value: T): void {
        const hash = this.hashKey(key);
        this.table[hash] = value;
    }

    // Obține valoarea asociată unei chei
    get(key: string): T | undefined {
        const hash = this.hashKey(key);
        return this.table[hash];
    }

    // Șterge o cheie din tabel
    delete(key: string): boolean {
        const hash = this.hashKey(key);
        if (this.table[hash] !== undefined) {
            delete this.table[hash];
            return true;
        }
        return false;
    }

    // Verifică dacă o cheie există în tabel
    has(key: string): boolean {
        const hash = this.hashKey(key);
        return this.table[hash] !== undefined;
    }

    // Funcție hash simplă
    private hashKey(key: string): string {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash |= 0; // Convertim la 32 de biți
        }
        return hash.toString();
    }
}

// Exemplu de utilizare
const hashTable = new HashTable<number>();

// Adăugăm valori
hashTable.set("order1", 100);
hashTable.set("order2", 200);

// Obținem valori
console.log(hashTable.get("order1")); // 100
console.log(hashTable.get("order2")); // 200

// Verificăm existența unei chei
console.log(hashTable.has("order1")); // true
console.log(hashTable.has("order3")); // false

// Ștergem o cheie
hashTable.delete("order1");
console.log(hashTable.get("order1")); // undefined