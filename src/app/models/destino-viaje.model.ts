

export class DestinoViaje {
 
    private selected: boolean;
    public servicios: string[];
    id: any;

    constructor(public nombre:string, public imagenUrl:string) { 
        this.servicios= ['piscina', 'buffet'];
    }

    isSelected(): boolean{
        return this.selected
    }

    setSelected(s:boolean){
        this.selected = s;   
    }
}
